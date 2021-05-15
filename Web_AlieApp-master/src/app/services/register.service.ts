import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RegisterService{

	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = 'http://localhost:3700/api';
	}

	RegisterUser(nombre: string, apellido: string, password: string, correo: string, telefono: number, genero: string, fechaNacimiento: string, fechaRegistro: string, direccion: string, username: string, estado: number, idRole: number, subject: string, comp: string): Observable<any>{
		return this._http.post(this.url + '/insertUser',
			{
				nombre: nombre,
				apellido: apellido,
				password: password,
				correo: correo,
				telefono: telefono,
				genero: genero,
				fechaNacimiento: fechaNacimiento,
				fechaRegistro: fechaRegistro,
				direccion: direccion,
				username: username,
				estado: estado,
				idRole: idRole,
				subject: subject,
				compl: comp
			}
		);
	}

	UpdateUser(id: number, nombre: string, apellido: string, password: string, correo: string, telefono: number, direccion: string){
		return this._http.put(this.url + '/updateUser', 
			{
				id: id,
				nombre: nombre,
				apellido: apellido,
				password: password,
				correo: correo,
				telefono: telefono,
				direccion: direccion
			}
		);
	}

	UpdateProfile(user: any): Observable<any>{
		return this._http.put(this.url + '/updateProfile',
			{
				id: user.id,
				nombre: user.nombre,
				apellido: user.apellido,
				password: user.password,
				correo: user.correo,
				foto: user.foto,
				telefono: user.telefono,
				direccion: user.direccion
			}
		);
	}

}