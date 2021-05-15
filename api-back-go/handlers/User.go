package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/EddieAlvarez01/golang-api-chat/database"
	"github.com/EddieAlvarez01/golang-api-chat/models"
	"github.com/EddieAlvarez01/golang-api-chat/responses"
	"github.com/go-playground/validator/v10"
)

//AddGuest REGISTRA UN INVITADO AL CHAT
func AddGuest(w http.ResponseWriter, r *http.Request) {
	req, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserta un valor valido")
		return
	}
	db := database.DBConn
	var role models.Role
	var user models.User
	var userTest models.User
	json.Unmarshal(req, &user)
	validate := validator.New()
	err = validate.Struct(user)
	if err != nil {
		//ERROR EN LAS VALIDACIONES
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Err(s):\n%+v\n", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	db.Preload("Role").Where(&models.User{Username: user.Username}).First(&userTest)
	if userTest.ID != 0 {
		switch userTest.Role.Name {
		case "USER":
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(responses.ErrorResponse{Code: "403", Message: "Un usuario ya ha registrado el nick"})
			return
		case "INVITADO":
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(userTest)
			return
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(responses.ErrorResponse{Code: "500", Message: "Error en el servidor"})
			return
		}
	}
	db.Where(&models.Role{Name: "INVITADO"}).First(&role)
	user.RoleID = role.ID
	db.Create(&user)
	if db.NewRecord(user) {
		//NO SE CREO EL USUARIO
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(responses.ErrorResponse{Code: "500", Message: "Error en el servidor"})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
	return
}

//Add AÑADE UN USUARIO AL CHAT (REGISTRO)
func Add(w http.ResponseWriter, r *http.Request) {
	req, error := ioutil.ReadAll(r.Body)
	if error != nil {
		http.Error(w, fmt.Sprintf("Inserte datos válidos"), http.StatusBadRequest)
		return
	}
	var user models.User
	json.Unmarshal(req, &user)
	if user.Password == "" {
		http.Error(w, fmt.Sprintf("Inserte una contraseña"), http.StatusBadRequest)
		return
	}
	validate := validator.New()
	error = validate.Struct(user)
	if error != nil {
		//DATOS INVALIDOS
		http.Error(w, fmt.Sprintf("Errores: \n%v", error), http.StatusBadRequest)
		return
	}
	db := database.DBConn
	var userTest models.User
	var role models.Role
	db.Preload("Role").Where(&models.User{Username: user.Username}).First(&userTest)
	db.Where(&models.Role{Name: "USER"}).First(&role)
	if userTest.ID != 0 {
		if userTest.Role.Name == "USER" {
			//ERORR EL USERNAME ESTA REGISTRADO
			w.WriteHeader(http.StatusBadRequest)
			http.Error(w, fmt.Sprintf("El nombre de usuario ya esta registrado"), http.StatusBadRequest)
			return
		}
		userTest.Password = user.Password
		hash, err := userTest.Encrypt()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error en el servidor (HASHING)"), http.StatusInternalServerError)
			return
		}
		userTest.Role = models.Role{}
		db.Model(&userTest).Updates(models.User{RoleID: role.ID, Password: hash})
		var updateUser models.User
		db.Preload("Role").Select("id, role_id, username, created_at").First(&updateUser, userTest.ID)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(updateUser)
		return
	}
	user.RoleID = role.ID
	hash, err := user.Encrypt()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error en el servidor (HASHING)"), http.StatusInternalServerError)
		return
	}
	user.Password = hash
	db.Create(&user)
	if db.NewRecord(user) {
		//NO SE GUARDO EN LA DB
		http.Error(w, fmt.Sprintf("Error en el servidor no se creo el usuario"), http.StatusInternalServerError)
		return
	}
	id := user.ID
	user = models.User{}
	db.Preload("Role").Select("id, role_id, username, created_at").First(&user, id)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

//Update ACTUALIZA EL NOMBRE DE USUARIO DE ALGUIEN REGISTRADO
func Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		fmt.Println(err)
		http.Error(w, fmt.Sprintf("ID inválido"), http.StatusBadRequest)
		return
	}
	db := database.DBConn
	var user models.User
	db.Preload("Role").Select("id, role_id, username, created_at").First(&user, id)
	if user.ID == 0 {
		http.Error(w, fmt.Sprintf("El usuario no existe"), http.StatusNotFound)
		return
	}
	req, error := ioutil.ReadAll(r.Body)
	if error != nil {
		http.Error(w, fmt.Sprintf("Ingrese datos válidos"), http.StatusBadRequest)
		return
	}
	var params models.User
	json.Unmarshal(req, &params)
	if user.Username != params.Username {
		validate := validator.New()
		err := validate.Struct(params)
		if err != nil {
			http.Error(w, fmt.Sprintf("Errores: \n%v", err), http.StatusBadRequest)
			return
		}
		db.Model(&user).Updates(models.User{Username: params.Username})
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

//Login loagea a un usuario
func Login(w http.ResponseWriter, r *http.Request) {
	req, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Inserte datos válidos"), http.StatusBadRequest)
		return
	}
	db := database.DBConn
	var user models.User
	json.Unmarshal(req, &user)
	validate := validator.New()
	errValidate := validate.Struct(user)
	if errValidate != nil {
		http.Error(w, fmt.Sprintf("Errores: \n%v", errValidate), http.StatusBadRequest)
		return
	}
	var userFind models.User
	db.Where(&models.User{Username: user.Username}).First(&userFind)
	if userFind.ID != 0 {
		if userFind.CheckPassword(user.Password) {
			user = models.User{}
			db.Preload("Role").Select("id, role_id, username, created_at").First(&user, userFind.ID)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(user)
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(responses.ErrorResponse{Code: "400", Message: "Credenciales Incorrectos"})
}
