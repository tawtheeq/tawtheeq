package router

import (
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
)

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Define your routes here, for example:
	// mux.HandleFunc("/api/users", handler.GetUsers)

	mux.HandleFunc("POST /api/users", h.AddUser)
	mux.HandleFunc("GET /api/users", h.GetUsers)
	mux.HandleFunc("GET /api/users/{id}", h.GetUserByID)
	mux.HandleFunc("PUT /api/users/{id}", h.UpdateUser)
	mux.HandleFunc("DELETE /api/users/{id}", h.DeleteUser)

	// mux.HandleFunc("GET /api/users/{id}/password", h.Upd)

	mux.HandleFunc("POST /api/missions", h.AddMission)
	mux.HandleFunc("GET /api/missions", h.GetAllMissions)
	mux.HandleFunc("GET /api/missions/{id}", h.GetMissionByID)
	mux.HandleFunc("PUT /api/missions/{id}", h.UpdateMission)
	mux.HandleFunc("DELETE /api/missions/{id}", h.DeleteMission)

	mux.HandleFunc("POST /api/users/{id}/leaves", h.AddLeaveToUser)
	mux.HandleFunc("GET /api/users/{id}/leaves", h.GetUserLeaves)
	mux.HandleFunc("PUT /api/users/leaves/{id}", h.UpdateLeave)
	mux.HandleFunc("DELETE /api/users/leaves/{id}", h.DeleteLeave)
	// mux.Han

	mux.HandleFunc("POST /api/missions/{id}/participants", h.AddParticipantsToMission)
	mux.HandleFunc("GET /api/missions/{id}/participants", h.GetMissionParticipants)
	mux.HandleFunc("DELETE /api/missions/{id}/participants", h.DeleteParticipantsByMission)
	mux.HandleFunc("DELETE /api/missions/{mid}/participants/{pid}", h.RemoveMissionParticipant)

	return mux
}
