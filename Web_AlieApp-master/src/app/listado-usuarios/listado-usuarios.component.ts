import { Component, OnInit } from '@angular/core';

import { ListadoUsuariosService } from '../services/listado-usuarios.service';

import { Usuario } from '../model/usuario';

//LibreriasJS
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css'],
  providers: [ListadoUsuariosService]
})
export class ListadoUsuariosComponent implements OnInit {

	public year: number;
	public users: Array<Usuario>;
  public url: string;

  	constructor(
  		private _listadoUsuariosService: ListadoUsuariosService
  	) {	
  		this.users = new Array();
      this.url = 'http://localhost:3700/api';
  	}

  	ngOnInit() {

  	}

  	Search(){
  		this.users = [];
  		this._listadoUsuariosService.SearchUsers(this.year).subscribe(
  			result => {
  				result.users.forEach((elemento) => {
  					let newUser = new Usuario(elemento.ID, elemento.NOMBRE, elemento.APELLIDO, null, elemento.CORREO, elemento.TELEFONO, elemento.FOTO, null, elemento.FECHANACIMIENTO,
  						elemento.FECHAREGISTRO, null, elemento.USERNAME, null, null, elemento.NOMBREROL);
  					this.users.push(newUser);
  				});
  			},
  			err => {
  				console.log(<any>err);
  				alert("Error en el servidor");
  			}
  		);
  	}

    Download(){
      var doc = new jsPDF('l');
      doc.text("Listado de usuarios nacidos arriba del año " + this.year, 10, 10);
      doc.autoTable({ html: '#userTb' });
      doc.save('Reporte_Usuarios.pdf');
    }

}
