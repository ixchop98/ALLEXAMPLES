package main

import (
	"fmt"
	"log"
	"net/http"

	"./database"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/rs/cors"

	handlersModels "./handlers"
	socketio "github.com/googollee/go-socket.io"
)

//INICIALIZAR CONEXION DE BASE DE DATOS
func initDB() {
	//fmt.Println("Iniciando base de datos")
	var err error
	database.DBConn, err = gorm.Open("mysql", "root:@(localhost:3306)/db_chat_golang?charset=utf8&parseTime=True")
	if err != nil {
		fmt.Println(err)
		panic("Error al conectar a la base de datos")
	}
	fmt.Println("Data base is connected")
}

var socket *socketio.Server
var router *mux.Router

func init() { //Inicializando todo lo necesario
	initDB() //Iniciando la base de datos
	socket = InitSocket()
	router = mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", handlersModels.Test).Methods("GET")
	router.HandleFunc("/user/create-guest", handlersModels.AddGuest).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/create", handlersModels.Add).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/update/{id}", handlersModels.Update).Methods("PUT", "OPTIONS")
	router.HandleFunc("/user/signin", handlersModels.Login).Methods("POST")

	//

}

func main() {
	defer database.DBConn.Close()
	go socket.Serve()
	defer socket.Close()
	router.Handle("/socket.io/", socket)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{"GET", "PUT", "OPTIONS", "POST", "DELETE"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)
	fmt.Println("Servidor en el puerto 4500")
	log.Fatal(http.ListenAndServe(":4500", handler))
}
