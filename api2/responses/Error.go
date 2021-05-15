package responses

import "github.com/go-playground/validator"

//ErrorResponse - STRUCT PARA MANDAR MENSAJES DE ERROR AL FRONTEND
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ErrorValidation struct {
	Code   string                      `json:"code"`
	Errors *validator.ValidationErrors `json:"errors"`
}
