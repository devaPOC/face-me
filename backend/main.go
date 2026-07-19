package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/username/face-time-clone/backend/internal/room"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for prototyping
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Expected path: /ws/{room_id}
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 || pathParts[2] == "" {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}
	roomID := pathParts[2]

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade: %v", err)
		return
	}

	client := &room.Client{
		Conn: ws,
		Send: make(chan []byte, 256),
	}

	rm := room.GetOrCreateRoom(roomID)

	if err := rm.Join(client); err != nil {
		ws.WriteMessage(websocket.TextMessage, []byte(`{"error": "Room is full"}`))
		ws.Close()
		return
	}

	// Go routine to pump messages to the client
	go func() {
		defer ws.Close()
		for msg := range client.Send {
			if err := ws.WriteMessage(websocket.TextMessage, msg); err != nil {
				log.Printf("Write error: %v", err)
				return
			}
		}
	}()

	// Read loop
	defer func() {
		rm.Leave(client)
		ws.Close()
	}()

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		// Route message to the other peer
		rm.Broadcast(client, msg)
	}
}

func main() {
	http.HandleFunc("/ws/", handleConnections)

	log.Println("Signaling server started on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
