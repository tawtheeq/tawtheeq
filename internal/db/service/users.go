package service

import (
	"context"
	"fmt"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterUser(user sqlc.AddUserParams) error {

	_, err := s.DBQueries.AddUser(context.Background(), sqlc.AddUserParams{
		Name:    user.Name,
		Email:   user.Email,
		Mobile:  user.Mobile,
		Job:     user.Job,
		Role:    user.Role,
		Balance: user.Balance,
	})

	if err != nil {
		return err
	}

	return nil

}

func (s *Services) GetAllUsers() ([]sqlc.User, error) {
	users, err := s.DBQueries.GetAllUsers(context.Background())
	if err != nil {
		// Log for debugging or wrap error with context
		return nil, fmt.Errorf("GetAllUsers: %w", err)
	}
	// fmt.Println("Retrieved users:", users)
	return users, nil
}

func (s *Services) GetUserByID(id int32) (sqlc.User, error) {

	user, err := s.DBQueries.GetUserByID(context.Background(), id)
	if err != nil {
		return sqlc.User{}, err
	}

	return user, nil
}

func (s *Services) UpdateUser(user sqlc.UpdateUserParams) error {

	_, err := s.DBQueries.UpdateUser(context.Background(), sqlc.UpdateUserParams{
		ID:     user.ID,
		Name:   user.Name,
		Email:  user.Email,
		Mobile: user.Mobile,
		Role:   user.Role,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *Services) UpdatePassword(id int32) error {

	_, err := s.DBQueries.UpdatePassword(context.Background(), sqlc.UpdatePasswordParams{ID: id})
	if err != nil {
		return err
	}
	return nil
}

func (s *Services) DeleteUser(id int32) error {
	err := s.DBQueries.DeleteUser(context.Background(), id)
	if err != nil {
		return err
	}

	return nil
}

func (s *Services) UpdateBalance(id int32) error {
	_, err := s.DBQueries.UpdateBalance(context.Background(), sqlc.UpdateBalanceParams{ID: id})
	if err != nil {
		return err
	}

	return nil
}
