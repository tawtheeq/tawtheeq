package service

import (
	"context"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterLeave(leave sqlc.CreateLeaveParams) error {
	_, err := s.DBQueries.CreateLeave(context.Background(), sqlc.CreateLeaveParams{
		UserID:    leave.UserID,
		StartDate: leave.StartDate,
		EndDate:   leave.EndDate,
		Reason:    leave.Reason,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) GetUserLeave(user_id int32) ([]sqlc.Leafe, error) {
	userLeaves, err := s.DBQueries.GetLeavesByUser(context.Background(), user_id)
	if err != nil {
		return nil, err
	}
	return userLeaves, nil
}

func (s *Services) GetAllLeaves() ([]sqlc.Leafe, error) {
	leaves, err := s.DBQueries.GetAllLeaves(context.Background())
	if err != nil {
		return nil, err
	}
	return leaves, nil
}

func (s *Services) UpdateLeave(leave sqlc.UpdateLeaveParams) error {
	_, err := s.DBQueries.UpdateLeave(context.Background(), sqlc.UpdateLeaveParams{
		ID:        leave.ID,
		StartDate: leave.StartDate,
		EndDate:   leave.EndDate,
		Reason:    leave.Reason,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) DeleteLeave(leave_id int32) error {
	err := s.DBQueries.DeleteLeave(context.Background(), leave_id)

	if err != nil {
		return err
	}

	return nil
}
