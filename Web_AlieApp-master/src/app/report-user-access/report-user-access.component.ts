import { Component, OnInit } from '@angular/core';

import { ListadoUsuariosService } from '../services/listado-usuarios.service';

import { UserFile } from '../model/user-file';

import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-report-user-access',
  templateUrl: './report-user-access.component.html',
  styleUrls: ['./report-user-access.component.css'],
  providers: [ListadoUsuariosService]
})
export class ReportUserAccessComponent implements OnInit {

	public listUsers: Array<UserFile>;
  public fecha: string;
  public fechaF: string;

  	constructor(
  		private _listadoUsuariosService: ListadoUsuariosService
  	) {
  		this.listUsers = new Array();
  	}

  	ngOnInit() {
  	}

    Search(){
      this.listUsers = [];
      this.fechaF = moment(this.fecha, 'YYYY-MM-DD').format('DD-MM-YYYY');
      this._listadoUsuariosService.GetUsersForFiles(this.fechaF).subscribe(
          result => {
            console.log(result);
            let rows: any = result.users;
            rows.forEach((item) => {
              let userF = new UserFile(item.NOMBRE, item.APELLIDO, item.USERNAME, item.CARPETAS, item.ARCHIVOS);
              this.listUsers.push(userF);
            });
          },
          err => {
            alert("Error en el servidor");
          }
      );
    }

    Download(){
        var doc = new jsPDF();
        doc.text("Listado de clientes registrados en la fecha " + this.fechaF, 10, 10);
        doc.autoTable({ html: '#userFileTB' });
        doc.save('Reporte_Usuarios_Archivos.pdf');
    }

}
