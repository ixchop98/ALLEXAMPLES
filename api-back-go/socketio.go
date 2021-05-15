package main

import (
	"fmt"
	"log"
	"net/http"

	engineio "github.com/googollee/go-engine.io"
	"github.com/googollee/go-engine.io/transport"
	"github.com/googollee/go-engine.io/transport/polling"
	"github.com/googollee/go-engine.io/transport/websocket"
	socketio "github.com/googollee/go-socket.io"

	"github.com/EddieAlvarez01/golang-api-chat/handlers"
)

var listSockets map[string]socketio.Conn = map[string]socketio.Conn{}

//InitSocket INICIALIZAR WEBSOCKET Y DEVOLVERLO
func InitSocket() *socketio.Server {
	pt := polling.Default
	wt := websocket.Default
	wt.CheckOrigin = func(req *http.Request) bool {
		return true
	}
	server, err := socketio.NewServer(&engineio.Options{
		Transports: []transport.Transport{
			pt,
			wt,
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("Un nuevo usuario conectado")
		s.Join("general")
		s.Emit("connected", s.ID())
		listSockets[s.ID()] = s
		return nil
	})

	//MENSAJES DEL CHAT GENERAL, NO SE GUARDAN EN BD, CUALQUIERA PUEDE DEJAR MENSAJES RANDOM
	server.OnEvent("/", "message-general", func(s socketio.Conn, data map[string]string) {
		server.BroadcastToRoom("", "general", "message-general", data)
	})

	//UN USUARIO LOGEADO LE VA ENVIAR MENSAJE PRIVADO A OTRO USER LOGEADO (CREA UN ROOM PERSONAL)
	server.OnEvent("/", "private", func(s socketio.Conn, data map[string]string) bool {
		conect, ok := listSockets[data["idReceiver"]] //SI NO EXISTE EL ID DEL SOCKET DEL RECEPTOR
		if ok {

			//VERIFICAR SI EXISTE EL NOMBRE DEL ROOM SI NO CREARLO
			if index := existRoom(server.Rooms(""), "imbox:"+data["id"]+":"+data["receiver"], "imbox:"+data["receiver"]+":"+data["id"]); index > 0 {
				s.Join(server.Rooms("")[index])
				conect.Join(server.Rooms("")[index])
				server.BroadcastToRoom("", server.Rooms("")[index], "addRoom", server.Rooms("")[index])
			} else {
				s.Join("imbox:" + data["id"] + ":" + data["receiver"])
				conect.Join("imbox:" + data["id"] + ":" + data["receiver"])
				server.BroadcastToRoom("", "imbox:"+data["id"]+":"+data["receiver"], "addRoom", "imbox:"+data["id"]+":"+data["receiver"])
			}
		}
		return ok
	})

	//EL USUARIO ENVIA MENSAJES A OTRO USER
	server.OnEvent("/", "imbox:message", func(s socketio.Conn, data map[string]string) bool {
		//ver el room
		if index := existRoom(server.Rooms(""), "imbox:"+data["id"]+":"+data["receiver"], "imbox:"+data["receiver"]+":"+data["id"]); index > 0 {
			message := handlers.AddMessage(data)
			if message.ID != 0 {
				server.BroadcastToRoom("", server.Rooms("")[index], "imbox:message", data)
				return true
			}
		}
		return false
	})

	//DESCONECTARSE
	server.OnEvent("/", "disconnect", func(s socketio.Conn) {
		delete(listSockets, s.ID())
		s.Close()
	})

	return server
}

//VERIFICAR SI UN ROOM DE DOS USERS EXISTE
func existRoom(rooms []string, name1 string, name2 string) int {
	for i, room := range rooms {
		if room == name1 {
			return i
		}
		if room == name2 {
			return i
		}
	}
	return -1
}
