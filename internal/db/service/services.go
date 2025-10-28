package service

import (
	"database/sql"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
)

type Services struct {
	DB        *sql.DB
	DBQueries *sqlc.Queries
}
