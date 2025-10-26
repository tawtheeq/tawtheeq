package router

import (
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Define your routes here, for example:
	// mux.HandleFunc("/api/users", handler.GetUsers)

	mux.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetUsers(w, r) // يجيب كل المستخدمين
		case http.MethodPost:
			h.AddUser(w, r) //
		default:
			response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		}

	})

	mux.HandleFunc("/api/users/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetUserByID(w, r)
		case http.MethodPut:
			h.UpdateUser(w, r)
		default:
			response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})
	mux.HandleFunc("/api/users", h.AddUser)
	mux.HandleFunc("/api/users", h.UpdateUser)

	// mux.HandleFunc("GET /api/update-password", )

	mux.HandleFunc("GET /api/missions", h.GetAllMissions)

	return mux
}
