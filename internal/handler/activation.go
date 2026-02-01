package handler

import (
	"encoding/json"
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

type ActivateRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

func (h *Handler) ActivateAccount(w http.ResponseWriter, r *http.Request) {
	var req ActivateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Token == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, "Token and password are required")
		return
	}

	user, err := h.svc.GetUserByInvitationToken(req.Token)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Invalid or expired token")
		return
	}

	err = h.svc.ActivateUser(user.ID, req.Password)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to activate account")
		return
	}

	response.Success(w, "Account activated successfully. You can now login.", nil)
}
