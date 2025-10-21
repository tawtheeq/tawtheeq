package service

import "github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"

type Services struct {
	DBQueries *sqlc.Queries
}
