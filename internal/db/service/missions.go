package service

import (
	"context"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterMission(mission sqlc.Mission) error {
	mission, err := s.DBQueries.CreateMission(context.Background(), sqlc.CreateMissionParams{
		MissionName:    mission.MissionName,
		CoordinatorNum: mission.CoordinatorNum,
		MainCategory:   mission.MainCategory,
		SubCategory:    mission.SubCategory, Month: mission.Month})
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) AddParticipantToMission(missionId, userId int32, role string) error {
	err := s.DBQueries.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
		MissionID: missionId,
		UserID:    userId,
		Role:      role,
	})
	if err != nil {
		return err
	}

	err = s.DBQueries.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
		MissionID: missionId,
		UserID:    userId,
		Role:      role,
	})
	if err != nil {
		return err
	}

	user, err := s.DBQueries.GetUserByID(context.Background(), userId)
	if err != nil {
		return err
	}

	missionData, err := s.DBQueries.GetMissionByID(context.Background(), missionId)
	if err != nil {
		return err
	}

	balance := user.Balance
	balance = balance - missionData.DurationDays

	_, err = s.DBQueries.UpdateBalance(context.Background(), sqlc.UpdateBalanceParams{
		Balance: balance,
		ID:      userId,
	})

	if err != nil {
		return err
	}

	return nil
}

func (s *Services) GetMissions() error {
	_, err := s.DBQueries.GetAllMissions(context.Background())
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) UpdateMission() {

}

func (s *Services) DeleteMission() {

}
