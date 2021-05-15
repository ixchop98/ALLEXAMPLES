import { Component, OnInit } from '@angular/core';

import { ManejoService } from '../services/manejo-archivos.service';

@Component({
  selector: 'app-report-tree',
  templateUrl: './report-tree.component.html',
  styleUrls: ['./report-tree.component.css'],
  providers: [ManejoService]
})
export class ReportTreeComponent implements OnInit {

	public field: Object;
	public dataTree: Array<Object>;

  	constructor(
  		private _manejoService: ManejoService
  	) { 
  		this.dataTree = new Array();
  	}

  	ngOnInit() {
  		this._manejoService.GetAllFolders().subscribe(
  			result => {
  				let rs: any = result.folders;
  				rs.forEach((folder) => {
  					if(folder.IDPADRE != null){
  						this.dataTree.push({id: folder.ID, pid: folder.IDPADRE, name: folder.NOMBRE, hasChild: true, nodeIcon: 'folder'});
  					}else{
  						this.dataTree.push({id: folder.ID, name: folder.NOMBRE, hasChild: true, nodeIcon: 'folder'});
  					}
  				});
  				this._manejoService.GetAllFiles().subscribe(
  					result => {
  						let rs2: any = result.files;
  						rs2.forEach((file) => {
  							this.dataTree.push({id: file.ID, pid: file.IDCARPETA, name: file.NOMBRE, nodeIcon: 'pdf'});
  						});
  						this.field = { dataSource: this.dataTree, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', iconCss: 'nodeIcon' };
  					},
  					err => {
  						alert("Error en el servidor");
  					}
  				);
  			},
  			err => {
  				alert("Error en el servidor");
  			}
  		);
  	}

}
