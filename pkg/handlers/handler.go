package handlers

import (
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

type ApiConfig struct {
	// Add any configuration fields needed for the API handlers
	DBQuries sqlc.Queries
}

func (cfg *ApiConfig) Welcome(w http.ResponseWriter, r *http.Request) {
	// This function will handle the request to get all users
	// You can implement the logic to fetch users from the database here

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Welcome to the Tawtheeq API as khalifa call it (MM)!"))
}
