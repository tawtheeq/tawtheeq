package service

import (
	"context"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterMission(mission sqlc.CreateMissionParams) error {
	_, err := s.DBQueries.CreateMission(context.Background(), sqlc.CreateMissionParams{
		MissionName:    mission.MissionName,
		CoordinatorNum: mission.CoordinatorNum,
		MainCategory:   mission.MainCategory,
		SubCategory:    mission.SubCategory,
		Month:          mission.Month,
		Year:           mission.Year,
		DurationDays:   mission.DurationDays,
		CreatedBy:      mission.CreatedBy,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *Services) AddParticipantToMission(participant sqlc.AddMissionParticipantParams) error {
	err := s.DBQueries.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
		MissionID: participant.MissionID,
		UserID:    participant.UserID,
		Role:      participant.Role,
	})
	if err != nil {
		return err
	}

	err = s.DBQueries.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
		MissionID: participant.MissionID,
		UserID:    participant.UserID,
		Role:      participant.Role,
	})
	if err != nil {
		return err
	}

	user, err := s.DBQueries.GetUserByID(context.Background(), participant.UserID)
	if err != nil {
		return err
	}

	missionData, err := s.DBQueries.GetMissionByID(context.Background(), participant.MissionID)
	if err != nil {
		return err
	}

	balance := user.Balance
	balance = balance - missionData.DurationDays

	_, err = s.DBQueries.UpdateBalance(context.Background(), sqlc.UpdateBalanceParams{
		Balance: balance,
		ID:      participant.UserID,
	})

	if err != nil {
		return err
	}

	return nil
}

func (s *Services) GetAllMissions() ([]sqlc.GetAllMissionsRow, error) {
	missions, err := s.DBQueries.GetAllMissions(context.Background())
	if err != nil {
		return nil, err
	}

	return missions, nil
}

func (s *Services) GetMissionByID(id int32) (sqlc.GetMissionByIDRow, error) {
	mission, err := s.DBQueries.GetMissionByID(context.Background(), id)
	if err != nil {
		return sqlc.GetMissionByIDRow{}, err
	}

	return mission, nil
}

func (s *Services) UpdateMission(mission sqlc.UpdateMissionParams) error {

	err := s.DBQueries.DeleteParticipantsByMission(context.Background(), mission.ID)

	if err != nil {
		return err
	}

	_, err = s.DBQueries.UpdateMission(context.Background(), sqlc.UpdateMissionParams{
		MissionName:    mission.MissionName,
		CoordinatorNum: mission.CoordinatorNum,
		MainCategory:   mission.MainCategory,
		SubCategory:    mission.SubCategory,
		Month:          mission.Month,
		Year:           mission.Year,
		DurationDays:   mission.DurationDays,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *Services) DeleteMission(missionId int32) error {
	err := s.DBQueries.DeleteMission(context.Background(), missionId)
	if err != nil {
		return err

	}

	return nil
}
