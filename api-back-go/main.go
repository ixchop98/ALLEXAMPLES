package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/rs/cors"

	"github.com/EddieAlvarez01/golang-api-chat/database"
	handlersModels "github.com/EddieAlvarez01/golang-api-chat/handlers"

	"github.com/gorilla/mux"
)

var router *mux.Router      //RUTAS
var socket *socketio.Server //WEBSOCKET

//Inicializar las rutas del servidor
func init() {
	initDB()              //INICIALIZAR DB
	socket = InitSocket() //INICIALIZAR SOCKET
	router = mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", handlersModels.Test).Methods("GET")
	router.HandleFunc("/user/create-guest", handlersModels.AddGuest).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/create", handlersModels.Add).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/update/{id}", handlersModels.Update).Methods("PUT", "OPTIONS")
	router.HandleFunc("/user/signin", handlersModels.Login).Methods("POST")
}

//INICIALIZAR CONEXION DE BASE DE DATOS
func initDB() {
	var err error
	database.DBConn, err = gorm.Open("mysql", "root:@(localhost:3306)/db_chat_golang?charset=utf8&parseTime=True")
	//database.DBConn, err = gorm.Open("mysql", "user1:21guns@(localhost:3306)/db_chat_golang?charset=utf8&parseTime=True")

	if err != nil {
		fmt.Println(err)
		panic("Error al conectar a la base de datos")
	}
	fmt.Println("Database is connected")
	//db.Close()
}

func main() {
	defer database.DBConn.Close() //CIERRA LA CONEXION CUANDO MAIN SE TERMINE DE EJECUTAR
	go socket.Serve()
	defer socket.Close() //CIERRA EL SOCKET CUANDO MAIN SE TERMINA

	router.Handle("/socket.io/", socket)

	//CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{"GET", "PUT", "OPTIONS", "POST", "DELETE"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)

	fmt.Println("Servidor en el puerto 4500")
	log.Fatal(http.ListenAndServe(":4500", handler))
}
