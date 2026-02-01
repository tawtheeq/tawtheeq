package router

import (
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
)

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// setup routes
	mux.HandleFunc("GET /api/setup/status", h.GetSetupStatus)
	mux.HandleFunc("POST /api/setup/register", h.RegisterFirstAdmin)

	// auth routes
	mux.HandleFunc("POST /api/login", h.Login)
	mux.HandleFunc("POST /api/activate", h.ActivateAccount)

	// user routes
	mux.Handle("POST /api/users", h.AuthMiddleware(http.HandlerFunc(h.AddUser)))
	mux.Handle("GET /api/users", h.AuthMiddleware(http.HandlerFunc(h.GetUsers)))
	mux.Handle("GET /api/users/{id}/report", h.AuthMiddleware(http.HandlerFunc(h.GetUserReport)))
	mux.Handle("GET /api/users/{id}", h.AuthMiddleware(http.HandlerFunc(h.GetUserByID)))
	mux.Handle("PUT /api/users/{id}", h.AuthMiddleware(http.HandlerFunc(h.UpdteUserBasicInfo)))
	mux.Handle("DELETE /api/users/{id}", h.AuthMiddleware(http.HandlerFunc(h.DeleteUser)))

	// categories routes
	mux.Handle("POST /api/categories", h.AuthMiddleware(http.HandlerFunc(h.AddCategory)))
	mux.Handle("GET /api/categories", h.AuthMiddleware(http.HandlerFunc(h.GetAllCategories)))
	mux.Handle("GET /api/maincategories", h.AuthMiddleware(http.HandlerFunc(h.GetMainCategories)))
	mux.Handle("GET /api/subcategories", h.AuthMiddleware(http.HandlerFunc(h.GetSubCategories)))
	mux.Handle("DELETE /api/categories/{id}", h.AuthMiddleware(http.HandlerFunc(h.DeleteCategory)))

	// missions routes
	mux.Handle("POST /api/missions", h.AuthMiddleware(http.HandlerFunc(h.AddMission)))
	mux.Handle("GET /api/missions", h.AuthMiddleware(http.HandlerFunc(h.GetAllMissions)))
	mux.Handle("GET /api/missions/{id}", h.AuthMiddleware(http.HandlerFunc(h.GetMissionByID)))
	mux.Handle("PUT /api/missions/{id}", h.AuthMiddleware(http.HandlerFunc(h.UpdateMission)))
	mux.Handle("PATCH /api/missions/{id}/status", h.AuthMiddleware(http.HandlerFunc(h.StatusUpdate)))
	mux.Handle("DELETE /api/missions/{id}", h.AuthMiddleware(http.HandlerFunc(h.DeleteMission)))

	// leaves routes
	mux.Handle("POST /api/users/{id}/leaves", h.AuthMiddleware(http.HandlerFunc(h.AddLeaveToUser)))
	mux.Handle("GET /api/users/{id}/leaves", h.AuthMiddleware(http.HandlerFunc(h.GetUserLeaves)))
	mux.Handle("PUT /api/leaves/{id}", h.AuthMiddleware(http.HandlerFunc(h.UpdateLeave)))
	mux.Handle("DELETE /api/leaves/{id}", h.AuthMiddleware(http.HandlerFunc(h.DeleteLeave)))

	// participants routes
	mux.Handle("POST /api/missions/{id}/participants", h.AuthMiddleware(http.HandlerFunc(h.AddParticipantsToMission)))
	mux.Handle("GET /api/missions/{id}/participants", h.AuthMiddleware(http.HandlerFunc(h.GetMissionParticipants)))
	mux.Handle("DELETE /api/missions/{id}/participants", h.AuthMiddleware(http.HandlerFunc(h.DeleteParticipantsByMission)))
	mux.Handle("DELETE /api/missions/{id}/participants/{participantId}", h.AuthMiddleware(http.HandlerFunc(h.RemoveMissionParticipant)))

	// signal routes
	mux.Handle("POST /api/signal/send", h.AuthMiddleware(http.HandlerFunc(h.SendMessage)))

	// negative balance routes
	mux.Handle("POST /api/users/{id}/allow-negative-balance", h.AuthMiddleware(http.HandlerFunc(h.AllowNegativeBalance)))
	mux.Handle("POST /api/users/{id}/disallow-negative-balance", h.AuthMiddleware(http.HandlerFunc(h.DisallowNegativeBalance)))

	return mux
}
