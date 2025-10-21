package handler

import "github.com/maadiab/tawtheeq/tawtheeq/internal/db/service"

type Handler struct {
	svc *service.Services
}

func NewHandler(svc *service.Services) *Handler {
	return &Handler{
		svc: svc,
	}
}
