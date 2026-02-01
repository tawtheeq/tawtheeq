package service

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"golang.org/x/crypto/bcrypt"
)

func (s *Services) RegisterUser(user sqlc.AddUserParams) error {
	_, err := s.DBQueries.AddUser(context.Background(), sqlc.AddUserParams{
		Name:            user.Name,
		Email:           user.Email,
		Mobile:          user.Mobile,
		Job:             user.Job,
		Role:            user.Role,
		Balance:         user.Balance,
		InvitationToken: user.InvitationToken,
		Blocked:         user.Blocked,
		NegativeBalance: user.NegativeBalance,
	})

	if err != nil {
		return err
	}

	return nil
}

func (s *Services) GetUserByEmail(email string) (sqlc.User, error) {
	user, err := s.DBQueries.GetUserByEmail(context.Background(), email)
	if err != nil {
		return sqlc.User{}, err
	}
	return user, nil
}

func (s *Services) GetUserByInvitationToken(token string) (sqlc.User, error) {
	user, err := s.DBQueries.GetUserByInvitationToken(context.Background(), sql.NullString{
		String: token,
		Valid:  true,
	})
	if err != nil {
		return sqlc.User{}, err
	}
	return user, nil
}

func (s *Services) ActivateUser(id int32, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("could not hash password: %w", err)
	}

	_, err = s.DBQueries.ActivateUser(context.Background(), sqlc.ActivateUserParams{
		ID:       id,
		Password: string(hashedPassword),
	})
	return err
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

func (s *Services) CountAdmins() (int64, error) {
	return s.DBQueries.CountAdmins(context.Background())
}
