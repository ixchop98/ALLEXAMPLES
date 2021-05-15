import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Usuario } from '../model/usuario';
import { RegisterService } from '../services/register.service';

//LibreriasJS
import * as moment from 'moment';

declare var $:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

	public usuarioReg: Usuario;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _registerService: RegisterService
  	) { 
  		this.usuarioReg = new Usuario(0, '', '', '', '', 0, '', 'M', '', '', '', '', 0, 0, '');
  	}

  	ngOnInit() {

  	}

  	RedirectHome(){
  		this._router.navigate(['/home']);
  	}

  	RedirectLogin(){
  		this._router.navigate(['/login']);
  	}

  	randString(id){
	  var dataSet = $(id).attr('data-character-set').split(',');  
	  var possible = '';
	  if($.inArray('a-z', dataSet) >= 0){
	    possible += 'abcdefghijklmnopqrstuvwxyz';
	  }
	  if($.inArray('A-Z', dataSet) >= 0){
	    possible += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	  }
	  if($.inArray('0-9', dataSet) >= 0){
	    possible += '0123456789';
	  }
	  if($.inArray('#', dataSet) >= 0){
	    possible += '![]{}()%&*$#^<>~@|';
	  }
	  var text = '';
	  for(var i=0; i < $(id).attr('data-size'); i++) {
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	  }
	  return text;
	}

	onSubmitForm(){
		var field = $('#psGenerated');
		this.usuarioReg.password = this.randString(field);
		this.usuarioReg.fechaRegistro = moment().format('DD-MM-YYYY HH:mm:ss');
		this.usuarioReg.fechaNacimiento = moment(this.usuarioReg.fechaNacimiento, 'YYYY-MM-DD').format('DD-MM-YYYY');
		this.usuarioReg.estado = -1;
		this.usuarioReg.idRole = 3;
		this._registerService.RegisterUser(this.usuarioReg.nombre, this.usuarioReg.apellido, this.usuarioReg.password, this.usuarioReg.correo, this.usuarioReg.telefono, 
			this.usuarioReg.genero, this.usuarioReg.fechaNacimiento, this.usuarioReg.fechaRegistro, this.usuarioReg.direccion, this.usuarioReg.username, this.usuarioReg.estado,
			this.usuarioReg.idRole, 'Confirmación de correo', 'Tienes 1 minuto antes de que esta contraseña expire.').subscribe(
				result => {
					console.log(result);
					alert("Usuario Registrado satisfactoriamente");
					this.RedirectLogin();
				},
				err => {
					console.log(<any>err);
				}
			);
	}

}
