package routers

import (
	"github.com/gorilla/mux"
	"github.com/maadiab/tawtheeq/tawtheeq/pkg/handlers"
)

func Router(cfg *handlers.ApiConfig) *mux.Router {
	// Create a new router instance
	router := mux.NewRouter()

	router.HandleFunc("/", cfg.Welcome).Methods("GET")

	return router
}
