import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-vision',
  templateUrl: './edit-vision.component.html',
  styleUrls: ['./edit-vision.component.css']
})
export class EditVisionComponent implements OnInit {

	 public vision: string;

  	constructor() { }

  	ngOnInit() {
  		this.vision = localStorage.getItem("vision");
  	}

  	setVision(){
  		localStorage.setIten("vision", this.vision);
      alert("Cambios guardados exitosamente");
  	}

}
