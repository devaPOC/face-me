package room

import (
	"errors"
	"log"
	"sync"

	"github.com/devaPOC/face-me/backend/internal/metrics"
	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Send chan []byte
}

type Room struct {
	ID      string
	Topic   string
	Clients map[*Client]bool
	mu      sync.Mutex
}

var (
	Rooms = sync.Map{} // map[string]*Room
)

// GetOrCreateRoom returns an existing room or creates a new one
func GetOrCreateRoom(id string, topic string) *Room {
	r, loaded := Rooms.LoadOrStore(id, &Room{
		ID:      id,
		Topic:   topic,
		Clients: make(map[*Client]bool),
	})
	if !loaded {
		metrics.ActiveRooms.Inc()
		log.Printf("Room %s created with topic: %s", id, topic)
	}
	return r.(*Room)
}

// GetRoom returns an existing room, if it exists
func GetRoom(id string) (*Room, bool) {
	r, ok := Rooms.Load(id)
	if !ok {
		return nil, false
	}
	return r.(*Room), true
}

// Join adds a client to the room, enforcing the 2-person limit
func (r *Room) Join(c *Client) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if len(r.Clients) >= 2 {
		metrics.RoomRejectionsTotal.Inc()
		return errors.New("room is full")
	}

	r.Clients[c] = true
	metrics.ActiveClients.Inc()
	log.Printf("Client joined room %s. Total occupants: %d", r.ID, len(r.Clients))
	return nil
}

// Leave removes a client from the room and cleans up if empty
func (r *Room) Leave(c *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.Clients[c]; ok {
		delete(r.Clients, c)
		metrics.ActiveClients.Dec()
		close(c.Send)
		log.Printf("Client left room %s. Total occupants: %d", r.ID, len(r.Clients))

		// Broadcast a leave event to all remaining clients in the room
		for client := range r.Clients {
			select {
			case client.Send <- []byte(`{"type":"leave"}`):
			default:
			}
		}
	}

	if len(r.Clients) == 0 {
		Rooms.Delete(r.ID)
		metrics.ActiveRooms.Dec()
		log.Printf("Room %s deleted (empty)", r.ID)
	}
}

// Broadcast sends a message to the other peer(s) in the room
func (r *Room) Broadcast(sender *Client, message []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for client := range r.Clients {
		if client != sender {
			select {
			case client.Send <- message:
			default:
				// If sending blocks, we assume client is disconnected/stuck. Leave handles cleanup.
			}
		}
	}
}
