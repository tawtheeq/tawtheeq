package main

import (
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
	database "github.com/maadiab/tawtheeq/tawtheeq/internal/db"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/service"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/handler"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/router"
)

func main() {
	database.Database()
	svc := &service.Services{
		DB:        database.DB,
		DBQueries: sqlc.New(database.DB), // Initialize your database queries here
	}

	defer database.DB.Close()
	h := handler.NewHandler(svc)
	mux := router.Router(h)

	server := http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	fmt.Println("Starting Tawtheeq API on port %S ...", server.Addr)

	fmt.Printf("Type of database.DB: %T\n", database.DB)

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Error while serving !!!", err)
		return
	}
}
