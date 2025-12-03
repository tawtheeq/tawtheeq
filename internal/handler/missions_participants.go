package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/service"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) GetMissionParticipants(w http.ResponseWriter, r *http.Request) {

	id := r.PathValue("id")

	missionId, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}
	participants, err := h.svc.DBQueries.GetMissionParticipants(context.Background(), int32(missionId))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to get mission participants")
		return
	}

	if len(participants) == 0 {
		response.Send(w, http.StatusOK, false, "No mission participants found", participants)
		return
	}

	response.Send(w, http.StatusOK, true, "Data retrieved successfully ...", participants)
}

func (h *Handler) AddParticipantsToMission(w http.ResponseWriter, r *http.Request) {

	var participant sqlc.AddMissionParticipantParams

	err := json.NewDecoder(r.Body).Decode(&participant)

	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return

	}

	err = h.svc.AddParticipantToMission(participant)
	if err != nil {
		if errors.Is(err, service.ErrParticipantNotFound) {
			response.Error(w, http.StatusBadRequest, "User not found !!!")
			return
		} else if errors.Is(err, service.ErrMissionNotFound) {
			response.Error(w, http.StatusBadRequest, "Mission not found !!!")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Failed to add participant to mission")
		return
	}

	response.Created(w, "Participant added to mission successfully", nil)
}

func (h *Handler) DeleteParticipantsByMission(w http.ResponseWriter, r *http.Request) {

	id := r.PathValue("id")

	missionId, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}

	err = h.svc.DBQueries.DeleteParticipantsByMission(context.Background(), int32(missionId))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to delete mission participants")
		return
	}

	response.Success(w, "Mission participants deleted successfully", nil)
}

func (h *Handler) RemoveMissionParticipant(w http.ResponseWriter, r *http.Request) {

	mid := r.PathValue("id")
	pid := r.PathValue("participantId")

	mission_id, err := strconv.Atoi(mid)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}

	participant_id, err := strconv.Atoi(pid)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid participant ID")
		return
	}

	removeParams := sqlc.RemoveMissionParticipantParams{

		MissionID: int32(mission_id),
		UserID:    int32(participant_id),
	}

	err = h.svc.DBQueries.RemoveMissionParticipant(context.Background(), removeParams)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to remove mission participant")
		return
	}

	response.Success(w, "Mission participant removed successfully", nil)
}
