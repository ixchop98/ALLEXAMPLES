import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ListadoUsuariosService } from '../services/listado-usuarios.service';

import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-home-crud-user',
  templateUrl: './home-crud-user.component.html',
  styleUrls: ['./home-crud-user.component.css'],
  providers: [ListadoUsuariosService]
})
export class HomeCrudUserComponent implements OnInit {

	public user: Usuario;
	public users: Array<Usuario>;

  	constructor(
  		private _listadoUsuariosService: ListadoUsuariosService,
      private _router: Router
  	) { 
  	}

  	ngOnInit() {
  		this.users = new Array();
  		this._listadoUsuariosService.ReturnAllUsers().subscribe(
  			result => {
  				let res: any = result;
  				res.users.forEach((element) => {
  					let newUser = new Usuario(element.ID, element.NOMBRE, element.APELLIDO, null, element.CORREO, element.TELEFONO, null, null, null, null, element.DIRECCION, element.USERNAME, null, null, element.NOMBREROL);
  					this.users.push(newUser);
  				});
  			},
  			error => {
  				console.log(<any>error);
  				alert("Error en el servidor");
  			}
  		);
  	}

    DeleteUser(id: number){
      this._listadoUsuariosService.DeleteUserById(id).subscribe(
        result => {
          alert("Usuario borrado exitosamente");
          let indexErase = 100;
          this.users.forEach((element, index) => {
            if(element.id == id){
              indexErase = index;
            }
          });
          this.users.splice(indexErase,1);
        },
        error => {
          console.log(<any>error);
          alert("Error en el servidor");
        }
      );
    }

    RedirectCreateUser(){
      this._router.navigate(['/createUser']);
    }

}
