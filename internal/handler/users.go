package handler

import (
	"encoding/json"
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var users []sqlc.User

	users, err := h.svc.GetAllUsers()
	if err != nil {
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(users)

	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

}

func (h *Handler) AddUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user sqlc.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	err = h.svc.RegisterUser(user)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User registered successfully"))

}

func (h *Handler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	// Implementation for getting a user by ID
}

func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	// Implementation for updating a user
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	// Implementation for deleting a user
}
