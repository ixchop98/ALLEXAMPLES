package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/EddieAlvarez01/golang-api-chat/database"
	"github.com/EddieAlvarez01/golang-api-chat/models"
)

func Test(w http.ResponseWriter, r *http.Request) {
	var roles models.Role
	db := database.DBConn
	db.Preload("Users").First(&roles, 2)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}
