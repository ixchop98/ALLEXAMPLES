import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ChangePasswordService } from '../services/change-password.service';
import { RegisterService } from '../services/register.service';

import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [ChangePasswordService, RegisterService]
})
export class EditUserComponent implements OnInit {

	public user: Usuario;
	public idUser: number;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _changePasswordService: ChangePasswordService,
  		private _registerService: RegisterService
  	) {
  		this.user = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  	}

  	ngOnInit() {
  		this._route.params.subscribe((params: Params) => {
  			this.idUser = params.id;
  			this._changePasswordService.ReturnedUser(this.idUser).subscribe(
  				result => {
  					let rs = result.user[0];
  					this.user.nombre = rs.NOMBRE;
  					this.user.apellido = rs.APELLIDO;
  					this.user.direccion = rs.DIRECCION;
  					this.user.telefono = rs.TELEFONO;
  					this.user.correo = rs.CORREO;
            this.user.password = rs.PASSWORD;
  				},
  				err => {
  					console.log(err);
  					alert("Error en el servidor");
  				}
  			);
  		});
  	}

  	RedirectHomeCrud(){
  		this._router.navigate(['/homeCrud']);
  	}

  	OnSubmit(){
      this._registerService.UpdateUser(this.idUser, this.user.nombre, this.user.apellido, this.user.password, this.user.correo, this.user.telefono, this.user.direccion).subscribe(
        result => {
          alert("Usuario actualizado correctamente");
          this.RedirectHomeCrud();
        },
        err => {
          alert("Error al editar el usuario");
          this.RedirectHomeCrud();
        }
      );
  	}

}
