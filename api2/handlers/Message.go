package handlers

import (
	"fmt"
	"strconv"

	"../database"
	"../models"
)

//GetMessagesRoom TRAE LOS MENSAJES DE DOS USERS
func GetMessagesRoom(sender uint, receiver uint) []models.Message {
	db := database.DBConn
	var messages []models.Message
	db.Where(&models.Message{Sender: sender, Receiver: receiver}).Find(&messages)
	fmt.Println(messages)
	return messages
}

//AddMessage AGREGA UN NUEVO MENSAJE
func AddMessage(data map[string]string) models.Message {
	db := database.DBConn
	receiver, err := strconv.Atoi(data["receiver"])
	if err != nil {
		fmt.Println("Error: ", err.Error())
		return models.Message{}
	}
	sender, err2 := strconv.Atoi(data["id"])
	if err2 != nil {
		fmt.Println("Error: ", err2.Error())
	}
	message := models.Message{
		Receiver: uint(receiver),
		Sender:   uint(sender),
		Message:  data["message"],
	}
	db.Create(&message)
	if db.NewRecord(message) {
		fmt.Println("Error no se pudo agregar el mensaje a la db")
		return models.Message{}
	}
	return message
}
