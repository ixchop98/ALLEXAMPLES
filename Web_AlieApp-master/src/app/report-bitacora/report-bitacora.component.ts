import { Component, OnInit } from '@angular/core';

import { ListadoUsuariosService } from '../services/listado-usuarios.service';

import { Bitacora } from '../model/bitacora';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-report-bitacora',
  templateUrl: './report-bitacora.component.html',
  styleUrls: ['./report-bitacora.component.css'],
  providers: [ListadoUsuariosService]
})
export class ReportBitacoraComponent implements OnInit {

	public bitacoraFiles: Array<Bitacora>;

  	constructor(
  		private _listadoUsuariosService: ListadoUsuariosService
  	) { 
  		this.bitacoraFiles = new Array();
  	}

  	ngOnInit() {
  		this._listadoUsuariosService.GetBitacora().subscribe(
  			result => {
  				let rows: any = result.bit;
  				rows.forEach((item) => {
  					let bit: Bitacora = new Bitacora(item.ACCION, item.NOMBRE, item.APELLIDO, item.FECHA, item.NOMBRECARPETA);
  					this.bitacoraFiles.push(bit);
  				});
  			},
  			err => {
  				alert("Error en el servidor");
  			}
  		);
  	}

  	Download(){
  		var doc = new jsPDF();
      	doc.text("Bitácora de cambios realizados ", 10, 10);
      	doc.autoTable({ html: '#bitacoraTD' });
      	doc.save('Reporte_Bitacora.pdf');
  	}

}
