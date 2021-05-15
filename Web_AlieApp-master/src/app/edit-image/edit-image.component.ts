import { Component, OnInit } from '@angular/core';

import { UploadService } from '../services/upload.service';
import { TransferService } from '../services/transfer.service';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css'],
  providers: [UploadService]
})
export class EditImageComponent implements OnInit {

	public fileToUpload: Array<File>;
	public url: string;

  	constructor(
  		private _uploadService: UploadService,
  		private _transferService: TransferService
  	) { 
  		this.url = 'http://localhost:3700/api';
  	}

  	ngOnInit() {
  	}

  	SaveChanges(){
  		this._uploadService.makeFileRequest(this.url + '/uploadLogo', [], this.fileToUpload, 'image')
  		.then((result) => {
  			this._transferService.sendImageName(result);
  			alert("Cambios guardados exitosamente");
  		})
  		.catch((err) => {
  			console.log(err);
  		});
  	}

  	fileEvent(fileInput: any){
  		this.fileToUpload = <Array<File>>fileInput.target.files;	
  	}

}
