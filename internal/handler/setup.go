package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) GetSetupStatus(w http.ResponseWriter, r *http.Request) {
	count, err := h.svc.CountAdmins()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to check setup status")
		return
	}

	setupRequired := count == 0
	response.Send(w, http.StatusOK, true, "Setup status retrieved", map[string]bool{
		"setup_required": setupRequired,
	})
}

type SetupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Mobile   string `json:"mobile"`
	Password string `json:"password"`
}

func (h *Handler) RegisterFirstAdmin(w http.ResponseWriter, r *http.Request) {
	// 1. Check if admin already exists
	count, err := h.svc.CountAdmins()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to check existing admins")
		return
	}

	if count > 0 {
		response.Error(w, http.StatusForbidden, "System already initialized")
		return
	}

	// 2. Decode request
	var req SetupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" || req.Email == "" || req.Mobile == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, "All fields are required")
		return
	}

	// 3. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	// 4. Create user
	_, err = h.svc.DBQueries.AddUser(context.Background(), sqlc.AddUserParams{
		Name:            req.Name,
		Email:           req.Email,
		Mobile:          req.Mobile,
		Job:             "System Admin",
		Role:            "admin",
		Blocked:         false,
		Balance:         60,
		NegativeBalance: true, // System admin typically shouldn't be blocked by balance
		InvitationToken: struct {
			String string
			Valid  bool
		}{String: "", Valid: false},
	})

	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create admin: %v", err))
		return
	}

	// We need the ID to update the password and status
	user, err := h.svc.GetUserByEmail(req.Email)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to retrieve created admin")
		return
	}

	// 5. Set password and activate
	_, err = h.svc.DBQueries.ActivateUser(context.Background(), sqlc.ActivateUserParams{
		ID:       user.ID,
		Password: string(hashedPassword),
	})

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to finalize admin setup")
		return
	}

	response.Send(w, http.StatusCreated, true, "System initialized successfully", nil)
}
