package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/maadiab/tawtheeq/tawtheeq/internal/db/sqlc"
	"github.com/maadiab/tawtheeq/tawtheeq/internal/response"
)

func (h *Handler) AddCategory(w http.ResponseWriter, r *http.Request) {

	var category sqlc.CreateCategoryParams

	err := json.NewDecoder(r.Body).Decode(&category)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error, please insert correct data !!!")
		return
	}

	_, err = h.svc.DBQueries.CreateCategory(context.Background(), category)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error inserting new category !!!")
		return
	}

	response.Success(w, "category added successfully ...", nil)

}

func (h *Handler) GetMainCategories(w http.ResponseWriter, r *http.Request) {

	mainCategories, err := h.svc.DBQueries.GetMainCategories(context.Background())

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error getting main categories !!!")
		return
	}

	response.Success(w, "main categories retrieved successfully ...", mainCategories)
}

func (h *Handler) GetSubCategories(w http.ResponseWriter, r *http.Request) {
	subCategories, err := h.svc.DBQueries.GetSubCategories(context.Background())

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error getting sub categories !!!")
		return
	}

	response.Success(w, "subcategories retrieved successfully ...", subCategories)
}

func (h *Handler) GetAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.DBQueries.GetAllCategories(context.Background())

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "error getting categories !!!")
		return
	}

	response.Success(w, "all categories retrieved successfully ...", categories)

}
