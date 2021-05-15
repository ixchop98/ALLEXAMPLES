import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService{

	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = 'http://localhost:3700/api';
	}

	LoginUser(username: string, password: string): Observable<any>{
		return this._http.post(this.url + '/loginUser',
			{
				username: username,
				password: password
			}
		);
	}

	ForwardTemporal(id: number, nombre: string, correo: string, password: string, fechaRegistro: string): Observable<any>{
		return this._http.put(this.url + '/temporalUpdate', 
			{
				id: id,
				name: nombre,
				correo: correo,
				password: password,
				fechaRegistro: fechaRegistro
			}
		);
	}

}