package service

import (
	"context"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

func (s *Services) RegisterUser(user sqlc.User) error {

	_, err := s.DBQueries.AddUser(context.Background(), sqlc.AddUserParams{
		Name:     user.Name,
		Email:    user.Email,
		Mobile:   user.Mobile,
		Password: user.Password,
		Balance:  user.Balance,
		Role:     user.Role,
	})

	if err != nil {
		return err
	}

	return nil

}

func (s *Services) GetAllUsers() ([]sqlc.User, error) {

	users, err := s.DBQueries.GetAllUsers(context.Background())
	if err != nil {
		return nil, err
	}

	return users, nil
}
