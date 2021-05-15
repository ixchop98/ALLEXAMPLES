package database

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" //IMPORT DEL DRIVER
)

var (
	//DBConn ES UN EXPORT DE LA CONEXION DE LA BD
	DBConn *gorm.DB
)
