import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListadoUsuariosService{

	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = 'http://localhost:3700/api';
	}

	SearchUsers(fecha: number): Observable<any>{
		return this._http.post(this.url + '/SearchYear',
			{
				fecha: fecha
			}
		);
	}

	ReturnAllUsers(): Observable<any>{
		return this._http.get(this.url + '/getUsers');
	}

	DeleteUserById(id: number): Observable<any>{
		return this._http.delete(this.url + '/deleteUser/' + id);
	}

	ReturnModifyUsers(nombreCarpeta: string, fechaInicial: string, fechaFinal: string): Observable<any>{
		return this._http.post(this.url + '/SearchModify',
			{
				nombreCarpeta: nombreCarpeta,
				fechaInicial: fechaInicial,
				fechaFinal: fechaFinal
			}
		);
	}

	GetBitacora(): Observable<any>{
		return this._http.get(this.url + '/getBitacora');
	}

	GetUsersForFiles(fecha: string): Observable<any>{
		return this._http.get(this.url + '/getFilesForUser/' + fecha);
	}

}