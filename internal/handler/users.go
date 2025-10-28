package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {

	users, err := h.svc.GetAllUsers()
	if err != nil {
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	if len(users) == 0 {
		response.Send(w, http.StatusOK, false, "No users found", users)
		return
	}

	response.Send(w, http.StatusOK, true, "Data retrieved successfully ...", users)
}

func (h *Handler) AddUser(w http.ResponseWriter, r *http.Request) {

	var user sqlc.AddUserParams

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if user.Name == "" || user.Email == "" || user.Mobile == "" {
		response.Error(w, http.StatusBadRequest, "Missing data")
		return
	}

	err = h.svc.RegisterUser(user)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to register user")
		fmt.Println(err)
		return
	}

	response.Created(w, "User registered successfully", nil)

}

func (h *Handler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	// Implementation for getting a user by ID

	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		response.Error(w, http.StatusBadRequest, "User ID is required")
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid User ID")
		return
	}

	user, err := h.svc.GetUserByID(int32(id))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to get user")
		fmt.Println(err)
		return
	}

	response.Success(w, "User retrieved successfully", user)
}

func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {

	var user sqlc.UpdateUserParams

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	err = h.svc.UpdateUser(user)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to update user")
		fmt.Println(err)
		return
	}

	response.Success(w, "User updated successfully", nil)

}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userId, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	err = h.svc.DeleteUser(int32(userId))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to delete user")
		return
	}

	response.Success(w, "User deleted successfully", nil)
}
