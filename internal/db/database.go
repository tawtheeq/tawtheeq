package database

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	// "github.com/joho/godotenv"
)

func Database() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}

	// Load environment variables
	// dbHost := "localhost" // Replace with os.Getenv("DB_HOST")
	DBURL := os.Getenv("DB_HOST")
	if DBURL == "" {
		log.Fatal("DB_HOST environment variable is not set")
		return
	}

	db, err := sql.Open("postgres", DBURL)
	if err != nil {
		log.Fatal("Error connecting to the database")
		return
	}

	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging the database")
		return
	}

}
