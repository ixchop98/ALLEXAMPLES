import { Component, OnInit } from '@angular/core';

import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css'],
  providers: [UploadService]
})
export class EditVideoComponent implements OnInit {

	public video: Array<File>;
  public url: string;
  public result: any;

  	constructor(
      private _uploadService: UploadService
    ) { 
      this.url = 'http://localhost:3700/api';
    }

  	ngOnInit() {
  	}

    SaveChanges(){
      this._uploadService.makeFileRequest(this.url + '/uploadVideo', [], this.video, 'video')
      .then((result) => {
        this.result = result;
        localStorage.setItem("video", this.result.video);
        alert("Cambios Guardados exitosamente");
      });
    }

  	FileEvent(fileInput: any){
  		this.video = <Array<File>> fileInput.target.files;
  	}

}
