package service

import (
	"context"
	"fmt"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterMission(mission sqlc.CreateMissionParams) (sqlc.Mission, error) {

	newMission, err := s.DBQueries.CreateMission(context.Background(), sqlc.CreateMissionParams{
		MissionName:     mission.MissionName,
		CoordinatorName: mission.CoordinatorName,
		CoordinatorNum:  mission.CoordinatorNum,
		MainCategory:    mission.MainCategory,
		SubCategory:     mission.SubCategory,
		Day:             mission.Day,
		Month:           mission.Month,
		Year:            mission.Year,
		Type:            mission.Type,
		DurationDays:    mission.DurationDays,
		CreatedBy:       mission.CreatedBy,
	})
	if err != nil {
		fmt.Println(err)
		return sqlc.Mission{}, err
	}
	return newMission, nil
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
		Day:            mission.Day,
		Month:          mission.Month,
		Year:           mission.Year,
		DurationDays:   mission.DurationDays,
		ID:             mission.ID,
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
