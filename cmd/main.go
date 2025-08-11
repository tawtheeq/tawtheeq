package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/pkg/handlers"
	"github.com/maadiab/tawtheeq/tawtheeq/pkg/routers"
)

func main() {

	godotenv.Load(".env")

	dbURL := os.Getenv("DB_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return
	}
	defer db.Close()

	Cfg := &handlers.ApiConfig{

		DBQuries: *sqlc.New(db), // Initialize your database queries here
	}

	router := routers.Router(Cfg)

	fmt.Println("Starting Tawtheeq API on port 8080...")
	http.ListenAndServe(":8080", router)
}
