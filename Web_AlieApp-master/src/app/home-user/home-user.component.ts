import { Component, OnInit, ViewChild} from '@angular/core';
import { TreeViewComponent, NodeSelectEventArgs, DragAndDropEventArgs, NodeCheckEventArgs, NodeEditEventArgs } from '@syncfusion/ej2-angular-navigations';

import { ManejoService } from '../services/manejo-archivos.service';

import { Usuario } from '../model/usuario';
import { Carpeta } from '../model/carpeta';

//LibreriasJS
import * as jsPDF from 'jspdf';
declare var $:any;

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
  providers: [ManejoService]
})
export class HomeUserComponent implements OnInit {

	public foldersToBinding: Array<Carpeta>;
	public dataTree: Array<Object>;
	public field: Object;
	@ViewChild('tree', {static: false})
    public tree: TreeViewComponent;
    public idCarpeta: number;
    public idArchivo: number;
    public nombreCarpeta: string;
    public nombreArchivo: string;
    public contenidoArchivo: string;
    public contentFile: string;
    public nameFile: string;
    public toDragFolder: number;
    public dragFile: number;
    public dragFolder: number;
    public parentFile: number;
    public arrSelect: Array<Object>;
    public toFolder: number;


  	constructor(
  		private _manejoService: ManejoService
  	) { 
  		this.foldersToBinding = new Array();
  		this.dataTree = new Array();
      this.arrSelect = new Array();
  	}

  	ngOnInit() {
  		let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
  		this._manejoService.GetFolders(usuario.id).subscribe(
  			result => {
  				if(result.folder){
  					let rows: any[] = result.folder;
  						rows.forEach((folder) => {
  						let newFolder = new Carpeta(folder.ID, folder.NOMBRE, folder.IDPADRE);
  						this.foldersToBinding.push(newFolder);
  					});
  					this.OrderFolders();
  					this._manejoService.GetFiles(usuario.id).subscribe(
  						result => {
  							if(result.file){
  								let rows: any[] = result.file;
  								rows.forEach((file) => {
  									this.dataTree.push({id: file.ID, pid: file.IDCARPETA, name: file.NOMBRE, nodeIcon: 'pdf'});
  								}); 
  							}
  							this.field = { dataSource: this.dataTree, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', iconCss: 'nodeIcon' };
  						},
  						error => {
  							alert("Error en el servidor e los files");
  						}
  					);
  				}
  			},
  			err => {
  				alert("Error en el servidor");
  			}
  		);
  	}

  	OrderFolders(){
  		for(let folder of this.foldersToBinding){
  			if(folder.idPadre != null){
  				this.dataTree.push({id: folder.id, pid: folder.idPadre, name: folder.nombre, hasChild: true, nodeIcon: 'folder'});
  			}else{
  				this.dataTree.push({id: folder.id, name: folder.nombre, hasChild: true, nodeIcon: 'folder'});
  			}
  		}
  	}

  	nodeSelected(e: NodeSelectEventArgs) {
  		let text: string = <string>e.nodeData.text;
        if(text.includes(".")){
        	this.idArchivo = <number>e.nodeData.id;
          this.nameFile = text;
        	this.idCarpeta = null;
          this.parentFile = <number>e.nodeData.parentID;
          this.LoadContent();
        }else{	
       		this.idCarpeta = <number>e.nodeData.id;
       		this.idArchivo = null;
       		//this.tree.addNodes([item]);
        }
    }

    NewFolder(){
    	let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
    	this._manejoService.NewFolderEnd(this.nombreCarpeta, this.idCarpeta, usuario.id).subscribe(
    		result => {
    			let rs: any = result;
    			alert("Carpeta Creada exitosamente");
    			let item = { id: rs.data.v_id, pid: this.idCarpeta, name: this.nombreCarpeta, hasChild: true, nodeIcon: 'folder' }
    			this.tree.addNodes([item]);
    			this.nombreCarpeta = '';
    		},	
    		err => {
    			alert("Error en el servidor");
    		}
    	);
    }

    NewFile(){
    	let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
    	this._manejoService.NewFileEnd(this.contenidoArchivo, this.nombreArchivo, usuario.id, this.idCarpeta).subscribe(
    		result => {
    			let rs: any = result;
    			alert("Archivo Creado Exitosamente");
    			let item = { id: rs.data.v_id, pid: this.idCarpeta, name: this.nombreArchivo, nodeIcon: 'pdf' }
    			this.tree.addNodes([item]);
    			this.nombreArchivo = '';
    			this.contenidoArchivo = '';
    		},
    		err => {
    			alert("Error en el servidor");
    		}
    	);
    }

    LoadContent(){
      this._manejoService.GetContentFile(this.idArchivo).subscribe(
        result => {
            this.contentFile = result.contenido.CONTENIDO;
        },
        err => {
            alert("Error al cargar archivo");
        }
      );
    }

    setContent(){
      let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
      this._manejoService.UpdateContentFile(this.idArchivo, this.contentFile, usuario.nombre, usuario.apellido, usuario.correo, this.nameFile).subscribe(
        result => {
          alert("Archivo actualizado correctamente");
        },
        err => {
          alert("Error en el server, correo o actualizar");
        }
      );
    }

    DownloadTxT(){
      var doc = new jsPDF('l');
      doc.text(this.nameFile, 10, 10);
      doc.text(this.contentFile, 10, 20);
      doc.save('Archivo.pdf');
    }

    nodeDrag(args: DragAndDropEventArgs): void {
      if(args.draggedNodeData.id != "0"){
        if (args.droppedNode.getElementsByClassName('folder').length === 0){
          args.dropIndicator = 'e-no-drop';
        }
      }else{
        args.dropIndicator = 'e-no-drop';
      }
    }

    public dragStop(args: DragAndDropEventArgs): void {
      if(args.draggedNodeData.id != "0"){
          if (args.droppedNode.getElementsByClassName('folder').length === 0){
                args.cancel = true;
          }else{
            if(args.draggedNodeData.parentID != args.droppedNodeData.id){
              if(args.draggedNode.getElementsByClassName('folder').length === 0){
                  this.dragFile = <number>args.draggedNodeData.id;
                  this.dragFolder = null;
                  this.toDragFolder = <number>args.droppedNodeData.id;
                  this._manejoService.UpdateMoveFile(this.dragFile, this.toDragFolder).subscribe(
                    result => {
                      alert("Archivo movido exitosamente");
                    },
                    err => {
                      alert("Error al mover archivo");
                    }
                  );
              }else{
                this.dragFolder = <number>args.draggedNodeData.id;
                this.dragFile = null;
                this.toDragFolder = <number>args.droppedNodeData.id;
                this._manejoService.UpdateMoveFolder(this.dragFolder, this.toDragFolder).subscribe(
                  result => {
                    alert("Carpeta movida exitosamente");
                  },
                  err => {
                    alert("Error al mover carpeta");
                  }
                );
              }
            }else{
              args.cancel = true;
            }
          }
      }else{
        args.cancel = true;
      }
    }

    editing(args: NodeCheckEventArgs) {
      //check whether node is root node or not
      if (args.node.parentNode.parentNode.nodeName !== "LI") {
        args.cancel = true;
      }
    }

    onNodeEdited(args: NodeEditEventArgs): void {
      console.log(args);
      if (args.newText.trim() == "") {
        args.cancel = true;
        alert("No puede renombrar vacio");
      }else{
        if(args.node.getElementsByClassName('folder').length === 0){
          this.dragFile = <number>args.nodeData.id;
          this.dragFolder = null;
          let newText: string = args.newText;
          this._manejoService.UpdateNameFile(this.dragFile, newText).subscribe(
            result => {
              alert("Archivo renombrado exitosamente");
            },
            err => {
              alert("Error al renombrar archivo");
            }
          );
        }else{
          this.dragFolder = <number>args.nodeData.id;
          this.dragFile = null;
          let newText: string = args.newText;
          this._manejoService.UpdateNameFolder(this.dragFolder, newText).subscribe(
            result => {
              alert("Carpeta renombrada exitosamente");
            },
            err => {
              alert("Error al renombrar carpeta");
            }
          );
        }
      }
    }

    LoadFolders(){
      this.arrSelect = [];
      let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
      this._manejoService.GetFoldersToCopy(this.parentFile, usuario.id).subscribe(
        result => {
          let rows: any = result.carpeta;
          rows.forEach((item) => {
            this.arrSelect.push({id: item.ID, nombre: item.NOMBRE});
          });
        },
        err => {
          alert("Error al cargar las carpetas");
        }
      );
    }

    Copy(){
      let usuario: Usuario = JSON.parse(localStorage.getItem("user"));
      this._manejoService.CopyNewFile(this.idArchivo, this.nameFile, usuario.id, this.toFolder).subscribe(
        result => {
          let rs: any = result;
          alert("Archivo Copiado Exitosamente");
          let item = { id: rs.data.v_id, pid: this.toFolder, name: this.nameFile, nodeIcon: 'pdf' }
          this.tree.addNodes([item]);
        },
        err => {
          alert("Error al copiar archivo");
        }
      );
    }
}
