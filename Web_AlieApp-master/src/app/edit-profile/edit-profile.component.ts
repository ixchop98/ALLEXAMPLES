import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RegisterService } from '../services/register.service';
import { ChangePasswordService } from '../services/change-password.service';
import { UploadService } from '../services/upload.service';

import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [RegisterService, ChangePasswordService, UploadService]
})
export class EditProfileComponent implements OnInit {

	public user: Usuario;
	public fileToUpload: Array<File>;
	public url: string;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _registerService: RegisterService,
  		private _changePasswordService: ChangePasswordService,
  		private _uploadService: UploadService
  	) { 
  		this.user = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  		this.fileToUpload = new Array();
  		this.url = 'http://localhost:3700/api';
  	}

  	ngOnInit() {
  		let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
  		console.log(this.fileToUpload);
  		this._changePasswordService.ReturnedUser(usuario.id).subscribe(
  			result => {
  				let rs: any = result.user[0];
  				this.user.id = usuario.id;
  				this.user.nombre = rs.NOMBRE;
  				this.user.apellido = rs.APELLIDO;
  				this.user.password = rs.PASSWORD;
  				this.user.correo = rs.CORREO;
  				this.user.telefono = rs.TELEFONO;
  				this.user.direccion = rs.DIRECCION;
  			},
  			err => {
  				alert("Error al cargar usuario");
  			}
  		);
  	}

  	fileEvent(fileInput: any){
  		this.fileToUpload = <Array<File>>fileInput.target.files;	
  	}

  	OnSubmit(){
  		let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
  		if(this.fileToUpload.length){
  			this._uploadService.makeFileRequest(this.url + '/uploadLogo', [], this.fileToUpload, 'image')
  			.then((result: any) => {
  				this.user.foto = result.image;
  				console.log(this.user);
  				this._registerService.UpdateProfile(this.user).subscribe(
  					result => {
  						alert("Usuario Actualizado exitosamente");
  						usuario.nombre = this.user.nombre;
  						usuario.foto = this.user.foto;
  						usuario.apellido = this.user.apellido;
  						usuario.correo = this.user.correo;
  						usuario.telefono = this.user.telefono;
  						usuario.direccion = this.user.direccion;
  						localStorage.setItem("user", JSON.stringify(usuario));
  					},
  					err => {
  						alert("Error al actualizar usuario");
  					}
  				);
  			})
  			.catch((err) => {
  				console.log(err);
  			});
  		}else{
  			this._registerService.UpdateProfile(this.user).subscribe(
  					result => {
  						alert("Usuario Actualizado exitosamente");
  						localStorage.setItem("user", JSON.stringify(this.user));
  					},
  					err => {
  						alert("Error al actualizar usuario");
  					}
  			);
  		}
  	}

}
