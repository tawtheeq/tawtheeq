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

// func (s *Services) AddParticipantToMission(missionId, userId int32, role string) error {
// 	err := s.DBQueries.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
// 		MissionID: missionId,
// 		UserID:    userId,
// 		Role:      role,
// 	})
// 	if err != nil {
// 		return err
// 	}

// _,db:= s.DBQueries.GetUserByID(context.Background(),userId)
// balance:= db.Balance
// balance= balance -10

// _,err:= s.DBQueries.UpdateBalance(context.Background(),sqlc.UpdateBalanceParams{Balance: ,ID:useruserId})
// if err !=nil {
// 	return err
// }

// 	return nil
// }

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
