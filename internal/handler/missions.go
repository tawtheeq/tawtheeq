package handler

import (
	"net/http"
	"strconv"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) GetAllMissions(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	missions, err := h.svc.GetAllMissions()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to get missions")
		return
	}

	if len(missions) == 0 {
		response.Send(w, http.StatusOK, false, "No missions found", missions)
		return
	}

	response.Send(w, http.StatusOK, true, "Data retrieved successfully ...", missions)
}

func (h *Handler) GetMissionByID(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	id := r.PathValue("id")

	missionId, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}

	mission, err := h.svc.GetMissionByID(int32(missionId))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to get mission")
		return
	}
	response.Success(w, "Mission retrieved successfully", mission)
}

func (h *Handler) AddMission(w http.ResponseWriter, r *http.Request) {

}

func (h *Handler) UpdateMission(w http.ResponseWriter, r *http.Request) {
	// Implementation for updating a mission
}

func (h *Handler) DeleteMission(w http.ResponseWriter, r *http.Request) {
	// Implementation for deleting a mission
}
