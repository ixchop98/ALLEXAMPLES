package handlers

import (
	"encoding/json"
	"net/http"

	"../database"
	"../models"
)

func Test(w http.ResponseWriter, r *http.Request) {
	var roles models.Role
	db := database.DBConn
	db.Preload("Users").First(&roles, 2)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}
