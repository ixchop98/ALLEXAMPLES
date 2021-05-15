import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-sobremi',
  templateUrl: './edit-sobremi.component.html',
  styleUrls: ['./edit-sobremi.component.css']
})
export class EditSobremiComponent implements OnInit {

	public sobreMi: string;

  	constructor() { }

  	ngOnInit() {
  		this.sobreMi = localStorage.getItem("sobreMi");
  	}

  	setSobreMi(){
  		localStorage.setItem("sobreMi", this.sobreMi);
  		alert("Cambios guardados exitosamente");
  	}

}
