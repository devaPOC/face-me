package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/username/face-time-clone/backend/internal/room"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for prototyping
	},
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func handleRoomsAPI(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// GET /api/rooms/{id}
	if r.Method == "GET" {
		pathParts := strings.Split(r.URL.Path, "/")
		if len(pathParts) < 4 || pathParts[3] == "" {
			http.Error(w, `{"error": "Invalid room ID"}`, http.StatusBadRequest)
			return
		}
		roomID := pathParts[3]

		rm, ok := room.GetRoom(roomID)
		if !ok {
			http.Error(w, `{"error": "Room not found"}`, http.StatusNotFound)
			return
		}

		// Hack: use a getter or public field length, but we can't safely read map length without lock
		// For now we omit occupants in this API to avoid data race, or we just rely on ID and Topic
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":    rm.ID,
			"topic": rm.Topic,
		})
		return
	}

	// POST /api/rooms
	if r.Method == "POST" {
		var body struct {
			ID    string `json:"id"`
			Topic string `json:"topic"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}
		
		if body.ID == "" {
			http.Error(w, `{"error": "Room ID is required"}`, http.StatusBadRequest)
			return
		}

		rm := room.GetOrCreateRoom(body.ID, body.Topic)
		
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":    rm.ID,
			"topic": rm.Topic,
		})
		return
	}

	http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
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

	rm := room.GetOrCreateRoom(roomID, "")

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
	http.HandleFunc("/api/rooms/", handleRoomsAPI) // handles /api/rooms and /api/rooms/{id}
	http.HandleFunc("/api/rooms", handleRoomsAPI)
	http.HandleFunc("/ws/", handleConnections)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Signaling server started on :%s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
