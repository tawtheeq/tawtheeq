package handlers

import (
	"net/http"
)

func (cfg *ApiConfig) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	// This function will handle the request to get all users
	// You can implement the logic to fetch users from the database here

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Get all users endpoint"))
}
