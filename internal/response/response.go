package response

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Status  int         `json:"status"`
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// Universal send function
func Send(w http.ResponseWriter, status int, success bool, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	resp := Response{
		Status:  status,
		Success: success,
		Message: message,
		Data:    data,
	}

	json.NewEncoder(w).Encode(resp)
}

// Shortcut for success
func Success(w http.ResponseWriter, message string, data interface{}) {
	Send(w, http.StatusOK, true, message, data)
}

// Shortcut for created resource
func Created(w http.ResponseWriter, message string, data interface{}) {
	Send(w, http.StatusCreated, true, message, data)
}

// Shortcut for failure
func Error(w http.ResponseWriter, status int, message string) {
	Send(w, status, false, message, nil)
}
