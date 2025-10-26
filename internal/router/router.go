package router

import (
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
)

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Define your routes here, for example:
	// mux.HandleFunc("/api/users", handler.GetUsers)

	mux.HandleFunc("GET /api/users", h.GetUsers)
	mux.HandleFunc("GET /api/users/{id}", h.GetUserByID)

	mux.HandleFunc("POST /api/users/", h.AddUser)

	mux.HandleFunc("PUT /api/users/{id}", h.UpdateUser)
	mux.HandleFunc("DELETE /api/users/{id}", h.DeleteUser)

	// mux.HandleFunc("GET /api/users/{id}/password", h.Upd)

	mux.HandleFunc("GET /api/missions", h.GetAllMissions)

	return mux
}
