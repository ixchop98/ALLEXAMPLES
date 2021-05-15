import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '../services/login.service';
import { TransferService } from '../services/transfer.service';

import { Usuario } from '../model/usuario';

//LibreriasJS
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

	public username: string;
	public password: string;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _loginService: LoginService,
      private _transferService: TransferService
  	) {
  		this.username = "";
  		this.password = "";
  	}

  	ngOnInit() {
  	}

    RedirectToChangePassword(id: number){
      this._router.navigate(['/changePassword/' + id]);
    }

    RedirectToReportLista(){
      this._router.navigate(['/listadoUsuarios']);
    }

    RedirectToHomeUser(){
      this._router.navigate(['/homeUser']);
    }

  	onSubmitLogin(){
  		let fechaActual = moment().format('DD-MM-YYYY HH:mm:ss');
  		this._loginService.LoginUser(this.username, this.password).subscribe(
  			result => {
  				let res: any = result.user;
  				if(res){
  					let user = res[0];
  					let fechaUser = moment(user.FECHAREGISTRO, 'DD-MM-YYYY HH:mm:ss').add(60, 's').format('DD-MM-YYYY HH:mm:ss');
            if(user.ESTADO != -1){
              switch(user.IDROLE){
                case 1:
                  let userJson: Usuario = JSON.parse(localStorage.getItem("user"));
                  userJson.id = user.ID;
                  userJson.nombre = user.NOMBRE;
                  userJson.apellido = user.APELLIDO;
                  userJson.correo = user.CORREO;
                  userJson.estado = user.ESTADO;
                  userJson.fechaRegistro = user.FECHAREGISTRO;
                  userJson.foto = user.FOTO;
                  userJson.idRole = user.IDROLE;
                  userJson.username = user.USERNAME;
                  localStorage.setItem("user", JSON.stringify(userJson));
                  this.setUserNav(userJson);
                  this.RedirectToReportLista();
                break;
                case 2:
                break;
                case 3:
                  let userJson2: Usuario = JSON.parse(localStorage.getItem("user"));
                  userJson2.id = user.ID;
                  userJson2.nombre = user.NOMBRE;
                  userJson2.apellido = user.APELLIDO;
                  userJson2.correo = user.CORREO;
                  userJson2.estado = user.ESTADO;
                  userJson2.fechaRegistro = user.FECHAREGISTRO;
                  userJson2.foto = user.FOTO;
                  userJson2.idRole = user.IDROLE;
                  userJson2.username = user.USERNAME;
                  localStorage.setItem("user", JSON.stringify(userJson2));
                  this.setUserNav(userJson2);
                  this.RedirectToHomeUser();
                break;
              }
            }else{
              if(moment(fechaActual, 'DD-MM-YYYY HH:mm:ss').isBefore(moment(fechaUser, 'DD-MM-YYYY HH:mm:ss'))){
                //Correcto
                this.RedirectToChangePassword(user.ID);
              }else{
                var field = $('#psGenerated');
                let temporalPas: string = this.randString(field);
                let fech = moment().format('DD-MM-YYYY HH:mm:ss');
                this._loginService.ForwardTemporal(user.ID, user.NOMBRE, user.CORREO, temporalPas, fech).subscribe(
                  result => {
                    alert("Se le acabo el tiempo de la contraseña temporal, se le envío una nueva a su correo");
                  },
                  err => {
                    alert("Error en el servidor");
                  }
                );
              }
            }
  				}else{
  					alert("Credenciales Incorrectos");
  				}
  			},
  			err => {
  				console.log(<any>err);
  				alert("Error en el servidor");
  			}
  		);
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

    setUserNav(user){
      this._transferService.createUserLogin(user);
    }
}
