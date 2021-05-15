package models

import "time"

type Role struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Users     []User    `json:"users"`
}

//TableName retorna el nombre de la tabla, ya que el orm pluraliza
func (Role) TableName() string {
	return "Role"
}
