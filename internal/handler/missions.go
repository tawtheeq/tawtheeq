package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) GetAllMissions(w http.ResponseWriter, r *http.Request) {

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

	missionParams := sqlc.CreateMissionParams{}
	err := json.NewDecoder(r.Body).Decode(&missionParams)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		fmt.Println(err)
		return
	}

	if missionParams.MissionName == "" ||
		missionParams.CoordinatorNum == 0 ||
		missionParams.DurationDays == 0 ||
		missionParams.Day == 0 ||
		missionParams.Month == 0 ||
		missionParams.Year == 0 ||
		missionParams.MainCategory == 0 ||
		missionParams.SubCategory == 0 ||
		missionParams.CreatedBy == 0 {
		response.Error(w, http.StatusBadRequest, "Missing data")
		return
	}

	err = h.svc.RegisterMission(missionParams)
	if err != nil {
		fmt.Println(err)
		response.Error(w, http.StatusInternalServerError, "Failed to add mission")
		return
	}

	response.Success(w, "Mission added successfully", nil)
}

func (h *Handler) UpdateMission(w http.ResponseWriter, r *http.Request) {

	id := r.PathValue("id")

	// body, _ := io.ReadAll(r.Body)
	// fmt.Println("BODY RECEIVED:", string(body))

	mission_id, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}

	missionsParams := sqlc.UpdateMissionParams{}
	missionsParams.ID = int32(mission_id)

	log.Println("Mission ID to update:", missionsParams.ID)

	err = json.NewDecoder(r.Body).Decode(&missionsParams)

	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if missionsParams.ID == 0 {
		response.Error(w, http.StatusBadRequest, "Mission ID is required")
		return
	}

	if missionsParams.MissionName == "" {
		response.Error(w, http.StatusBadRequest, "Mission name is required")
		return
	}

	err = h.svc.UpdateMission(missionsParams)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to update mission")
		return
	}

	response.Success(w, "Mission updated successfully", nil)
}

func (h *Handler) DeleteMission(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	mission_id, err := strconv.Atoi(id)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid mission ID")
		return
	}

	h.svc.DeleteMission(int32(mission_id))

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to delete mission")
		return

	}

	response.Success(w, "Mission deleted successfully", nil)
}
