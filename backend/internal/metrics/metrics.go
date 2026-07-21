package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	ActiveRooms = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "faceme_active_rooms",
		Help: "Total active rooms currently held in the sync.Map",
	})

	ActiveClients = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "faceme_active_clients",
		Help: "Total connected WebSocket peers across all rooms",
	})

	WebsocketMessagesTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "faceme_websocket_messages_total",
		Help: "Total signaling messages processed, labeled by message type",
	}, []string{"type"})

	RoomRejectionsTotal = promauto.NewCounter(prometheus.CounterOpts{
		Name: "faceme_room_rejections_total",
		Help: "Total room capacity rejections (when a 3rd user attempts to join)",
	})
)
