package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

var ErrParticipantNotFound = errors.New("participant ot found")
var ErrMissionNotFound = errors.New("mission not found")

func (s *Services) AddParticipantToMission(participant sqlc.AddMissionParticipantParams) error {

	tx, err := s.DB.BeginTx(context.Background(), nil)
	if err != nil {
		fmt.Println("Error in beginTX !!!")
		return err
	}

	// defer tx.Rollback()
	qtx := s.DBQueries.WithTx(tx)
	user, err := qtx.GetUserByID(context.Background(), participant.UserID)
	if err != nil {
		fmt.Println(ErrParticipantNotFound)
		tx.Rollback()
		return ErrParticipantNotFound
	}

	missionData, err := qtx.GetMissionByID(context.Background(), participant.MissionID)
	if err != nil {
		fmt.Println(ErrMissionNotFound)
		tx.Rollback()
		return ErrMissionNotFound
	}

	missionStart := time.Date(
		int(missionData.Year),
		time.Month(missionData.Month),
		int(missionData.Day),
		0, 0, 0, 0,
		time.UTC,
	)

	missionEnd := missionStart.AddDate(0, 0, int(missionData.DurationDays)-1)

	hasConflict, err := qtx.CheckUserLeaveConflict(context.Background(), sqlc.CheckUserLeaveConflictParams{
		UserID:      user.ID,
		StartDate:   missionStart,
		StartDate_2: missionEnd,
	})

	if hasConflict {
		tx.Rollback()
		return fmt.Errorf("user has a leave during mission period (%s to %s)",
			missionStart.Format("02-01-2006"),
			missionEnd.Format("02-01-2006"))
	}

	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to check leave conflict: %w", err)
	}

	if missionData.Type == "external" {

		if user.NegativeBalance == "no" && user.Balance < missionData.DurationDays {
			tx.Rollback()
			return fmt.Errorf("insufficient balance: user has %d days, mission requires %d days",
				user.Balance, missionData.DurationDays)
		}

		newBalance := user.Balance - missionData.DurationDays
		_, err = qtx.UpdateBalance(context.Background(), sqlc.UpdateBalanceParams{
			Balance: newBalance,
			ID:      participant.UserID,
		})

		if err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to update balance: %w", err)
		}
	}

	// Only deduct balance for external missions
	// if missionData.Type == "external" {
	// }

	err = qtx.AddMissionParticipant(context.Background(), sqlc.AddMissionParticipantParams{
		MissionID: participant.MissionID,
		UserID:    participant.UserID,
		Role:      participant.Role,
	})
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error in adding participant: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("transaction failed for: %w", err)

	}
	return nil

}

func (s *Services) AllowNegativeBalance(userID int32) error {
	err := s.DBQueries.AllowNegativeBalance(context.Background(), userID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) DisallowNegativeBalance(userID int32) error {
	err := s.DBQueries.DisallowNegativeBalance(context.Background(), userID)
	if err != nil {
		return err
	}
	return nil
}
