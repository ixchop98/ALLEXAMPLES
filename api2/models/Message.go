package models

import "time"

type Message struct {
	ID           uint      `json:"id"`
	Receiver     uint      `json:"receiver"`
	Sender       uint      `json:"sender"`
	ReceiverUser User      `json:"receiver_user" gorm:"foreignkey:Receiver"`
	SenderUser   User      `json:"sender_user" gorm:"foreignkey:Sender"`
	Message      string    `json:"message"`
	Active       uint8     `json:"active"`
	CreatedAt    time.Time `json:"created_at"`
}

//TableName PARA INDICAR EL NOMBRE DE LA TABLA
func (Message) TableName() string {
	return "Message"
}
