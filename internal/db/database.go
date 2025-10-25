package database

import (
	"database/sql"
	"fmt"
	"os"

	// "github.com/jmoiron/sqlx"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	// "github.com/joho/godotenv"
)

var DB *sql.DB

func Database() {
	godotenv.Load(".env")

	dbURL := os.Getenv("DB_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return
	} else {
		fmt.Println("Successfully connected to the database")
	}

	if err := db.Ping(); err != nil {
		fmt.Println("Error pinging the database:", err)
		return
	} else {
		fmt.Println("Successfully pinged the database")
	}

	DB = db

}
