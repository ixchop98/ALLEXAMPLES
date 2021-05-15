package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID               uint      `json:"id"`
	RoleID           uint      `json:"role_id"`
	Role             Role      `json:"role"`
	Username         string    `json:"username" validate:"required,alphanumunicode"`
	Password         string    `json:"password,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"-"`
	MessagesReceiver []Message `gorm:"foreignkey:Receiver"`
	MessagesSender   []Message `gorm:"foreignkey:Sender"`
}

//TableName es para el nombre de la tabla en mysql
func (User) TableName() string {
	return "User"
}

//Encrypt ENCRIPTA LA CONSTRASEÑA Y DEVUELVE EL HASH
func (u User) Encrypt() (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), 4)
	return string(bytes), err
}

//CheckPassword VERIFICA SI UNA CONTRASEÑA ES IGUAL A UN HASH (LOGIN)
func (u User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
