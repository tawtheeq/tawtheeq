package main

import (
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
	database "github.com/maadiab/tawtheeq/tawtheeq/internal/db"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/service"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
)

func main() {

	svc := &service.Services{
		DBQueries: sqlc.New(database.DB), // Initialize your database queries here
	}

	h := handler.NewHandler(svc)
	mux := http.NewServeMux()

	server := http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	mux.HandleFunc("/api/users", h.GetUsers)

	fmt.Println("Starting Tawtheeq API on port %S...", server.Addr)

	fmt.Printf("Type of database.DB: %T\n", database.DB)

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Error while serving !!!", err)
		return
	}
}
