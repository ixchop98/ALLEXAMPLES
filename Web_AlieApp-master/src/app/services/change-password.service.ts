import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChangePasswordService{

	public url: string;

	constructor(
		public _http: HttpClient
	){
		this.url = 'http://localhost:3700/api';
	}

	ConfirmPassword(password: string, id: number): Observable<any>{
		return this._http.post(this.url + '/changePassword',
			{
				password: password,
				estado: 0,
				id: id
			}
		);
	}

	ReturnedUser(id: number): Observable<any>{
		return this._http.post(this.url + '/returnUser',
			{
				id: id
			}
		);
	}

}