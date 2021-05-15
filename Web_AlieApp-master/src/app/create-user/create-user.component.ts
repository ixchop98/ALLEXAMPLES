import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RegisterService } from '../services/register.service';

import { Usuario } from '../model/usuario';

//LibreriasJS
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  providers: [RegisterService]
})
export class CreateUserComponent implements OnInit {

	public user: Usuario;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _registerService: RegisterService
  	) {
  		this.user = new Usuario(null, '', '', '', '', null, '', 'M', '', '', '', '', null, 1, '');
  	}

  	ngOnInit() {
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

  	RedirectToHome(){
  		this._router.navigate(['/homeCrud']);
  	}

  	onSubmitForm(){
  		var field = $('#psGenerated');
  		this.user.password = this.randString(field);
  		this.user.fechaRegistro = moment().format('DD-MM-YYYY HH:mm:ss');
  		this.user.fechaNacimiento = moment(this.user.fechaNacimiento, 'YYYY-MM-DD').format('DD-MM-YYYY');
  		let sub: string;
  		let compl: string;
  		if(this.user.idRole == 3){
  			this.user.estado = -1;
  			sub = 'Confirmación de correo';
  			compl = 'Tienes 1 minuto antes de que esta contraseña expire.';
  		}else{
  			this.user.estado = 0;
  			sub = 'credenciales para ingreso a Alie';
  			compl = '';
  		}
  		this._registerService.RegisterUser(this.user.nombre, this.user.apellido, this.user.password, this.user.correo, this.user.telefono, 
			this.user.genero, this.user.fechaNacimiento, this.user.fechaRegistro, this.user.direccion, this.user.username, this.user.estado,
			this.user.idRole, sub, compl).subscribe(
				result => {
					console.log(result);
					alert("Usuario Creado satisfactoriamente");
					this.RedirectToHome();
				},
				err => {
					console.log(<any>err);
					alert("Error al crear el usuario");
				}
		);
  	}

}
