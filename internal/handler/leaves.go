package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) GetUserLeaves(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	user_id, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusNotFound, "user not found !!!")
		return
	}

	userLeaves, err := h.svc.DBQueries.GetLeavesByUser(context.Background(), int32(user_id))

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error getting user leaves !!!")
		return
	}

	response.Success(w, "user leaves retrieved successfully ...", userLeaves)
}

func (h *Handler) AddLeaveToUser(w http.ResponseWriter, r *http.Request) {

	var leave sqlc.CreateLeaveParams

	err := json.NewDecoder(r.Body).Decode(&leave)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "error cannot do it like this !!!")
		return
	}
	_, err = h.svc.DBQueries.CreateLeave(context.Background(), leave)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error registering leave for this user !!!")
		return
	}

	response.Success(w, "leave registered successfully ...", nil)
}

func (h *Handler) UpdateLeave(w http.ResponseWriter, r *http.Request) {

	var leave sqlc.UpdateLeaveParams

	err := json.NewDecoder(r.Body).Decode(&leave)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "please give right data !!!")
		return
	}

	err = h.svc.UpdateLeave(leave)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error while updating leave data !!!")
		return
	}

	response.Success(w, "leave updated successfully ...", nil)
}

func (h *Handler) DeleteLeave(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	leave_id, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "please provide correct data !!!")
		return
	}

	err = h.svc.DeleteLeave(int32(leave_id))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error deleting leave !!!")
		return
	}

	response.Success(w, "leave deleted successfully ...", nil)
}
