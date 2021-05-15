import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ChangePasswordService } from '../services/change-password.service';
import { TransferService } from '../services/transfer.service';

import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {

	@Output() getUser = new EventEmitter();

	public password: string;
	public confirmPassword: string;
	public idUser: number;
	public user: any;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _changeService: ChangePasswordService,
  		private _transferService: TransferService
  	) { 
  		this.password = "";
  		this.confirmPassword = "";
  	}

  	ngOnInit() {
  		this._route.params.subscribe((params: Params) => {
  			this.idUser = params.id;
  		});
  	}

  	RedirectHomeClient(){
  		this._router.navigate(['']);
  	}

    RedirectToHomeUser(){
      this._router.navigate(['/homeUser']);
    }

  	onSubmitPassword(){
  		this._changeService.ConfirmPassword(this.password, this.idUser).subscribe(
  			result => {
  				alert("Contraseña cambiada exitosamente");
  				this._changeService.ReturnedUser(this.idUser).subscribe(
  					result => {
  						this.user = result.user[0];
  						let userJson2: Usuario = new Usuario(this.user.ID, this.user.NOMBRE, this.user.APELLIDO, null, this.user.CORREO, null, this.user.FOTO, null, null, this.user.FECHAREGISTRO, null, this.user.USERNAME, this.user.ESTADO, this.user.IDROLE, null);
              localStorage.setItem("user", JSON.stringify(userJson2));
              this.obtUser(userJson2);
              this.RedirectToHomeUser();
  					},
  					err => {
  						console.log(<any>err);
  						alert("Error en el servidor segunda consulta");
  					}
  				);
  			},
  			err => {
  				console.log(<any>err);
  				alert("Error en el servidor");
  			}
  		);
  	}

  	obtUser(user){
  		this._transferService.createUserLogin(user);
  	}

}
