import { Component, OnInit } from '@angular/core';

import { ListadoUsuariosService } from '../services/listado-usuarios.service';

import { GReport_Modify } from '../model/GReport_Modify'; 

//LibreriasJS
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-report-modify',
  templateUrl: './report-modify.component.html',
  styleUrls: ['./report-modify.component.css'],
  providers: [ListadoUsuariosService]
})
export class ReportModifyComponent implements OnInit {

	public nombreCarpeta: string;
	public fechaInicio: string;
	public fechaFinal: string;
	public items: Array<GReport_Modify>;

  	constructor(
  		private _listadoUsuariosService: ListadoUsuariosService
  	) { 
  		this.items = new Array();
  	}

  	ngOnInit() {

  	}

  	Search(){
      this.items = [];
  		this.fechaInicio = moment(this.fechaInicio, 'YYYY-MM-DD').format('DD-MM-YYYY');
  		this.fechaFinal = moment(this.fechaFinal, 'YYYY-MM-DD').format('DD-MM-YYYY');
  		this._listadoUsuariosService.ReturnModifyUsers(this.nombreCarpeta, this.fechaInicio, this.fechaFinal).subscribe(
  			result => {
  				let rows: any = result.users;
  				rows.forEach((item) => {
  					let GReport = new GReport_Modify(item.NOMBRE, item.APELLIDO, item.USERNAME, item.NOMBRECARPETA, item.ACCION);
  					this.items.push(GReport);
  				});
  			},
  			err => {
  				alert("Error en el servidor");
  			}
  		);
  	}

  	Download(){
  		var doc = new jsPDF('');
      	doc.text("Listado de clientes que han realizado una modificacion en " + this.nombreCarpeta, 10, 10);
      	doc.autoTable({ html: '#modifyTD' });
      	doc.save('Reporte_Modificacion.pdf');
  	}

}
