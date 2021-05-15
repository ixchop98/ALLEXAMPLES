import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ManejoService{

	public url: String;

	constructor(
		public _http: HttpClient
	){
		this.url = 'http://localhost:3700/api';
	}

	GetFolders(id: number): Observable<any>{
		return this._http.get(this.url + '/getFoldersUser/' + id);
	}

	GetFiles(id: number): Observable<any>{
		return this._http.get(this.url + '/getFilesUser/' + id);
	}

	NewFolderEnd(nombre: string, idPadre: number, idUser: number): Observable<any>{
		return this._http.post(this.url + '/createNewFolder', 
			{
				nombre: nombre,
				idPadre: idPadre,
				idUser: idUser
			}
		);
	}

	NewFileEnd(contenido: string, nombre: string, idUser: number, idCarpeta: number): Observable<any>{
		return this._http.post(this.url + '/createNewFile', 
			{
				contenido: contenido,
				nombre: nombre,
				idUser: idUser,
				idCarpeta: idCarpeta
			}
		);
	}

	GetAllFolders(): Observable<any>{
		return this._http.get(this.url + '/getAllFolders');
	}

	GetAllFiles(): Observable<any>{
		return this._http.get(this.url + '/getAllFiles');
	}

	GetContentFile(id: number): Observable<any>{
		return this._http.get(this.url + '/getContentFile/' + id);
	}

	UpdateContentFile(id: number, contenido: string, nombre: string, apellido: string, correo: string, nombreArchivo: string): Observable<any>{
		return this._http.put(this.url + '/updateContentFile',
			{
				correo: correo,
				nombre: nombre,
				apellido: apellido,
				nombreArchivo: nombreArchivo,
				contenido: contenido,
				id: id
			} 
		);
	}

	UpdateMoveFile(id: number, idCarpeta: number): Observable<any>{
		return this._http.put(this.url + '/updateMoveFile', 
			{
				idCarpeta: idCarpeta,
				id: id
			}
		);
	}

	UpdateMoveFolder(id: number, idPadre: number): Observable<any>{
		return this._http.put(this.url + '/updateMoveFolder', 
			{
				idPadre: idPadre,
				id: id
			}
		);
	}

	UpdateNameFile(id: number, nombre: string): Observable<any>{
		return this._http.put(this.url + '/UpdateNameFile', 
			{
				nombre: nombre,
				id: id
			}
		);
	}

	UpdateNameFolder(id: number, nombre: string): Observable<any>{
		return this._http.put(this.url + '/updateNameFolder',
			{
				nombre: nombre,
				id: id
			}
		);
	}

	GetFoldersToCopy(id: number, idUsuario: number): Observable<any>{
		return this._http.post(this.url + '/GetFoldersToCopy', 
			{
				id: id,
				idUsuario: idUsuario
			}
		);
	}

	CopyNewFile(id: number, nombre: string, idUser: number, idCarpeta: number): Observable<any>{
		return this._http.post(this.url + '/CopyNewFile', 
			{
				id: id,
				nombre: nombre,
				idUser: idUser,
				idCarpeta: idCarpeta
			}
		);
	}

}