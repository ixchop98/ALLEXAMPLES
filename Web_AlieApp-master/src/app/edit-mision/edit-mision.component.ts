import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-mision',
  templateUrl: './edit-mision.component.html',
  styleUrls: ['./edit-mision.component.css'],
  providers: []
})
export class EditMisionComponent implements OnInit {


	public mision: string;

  constructor(
  ) {}

  ngOnInit() {
    this.mision = localStorage.getItem("mision");
  }

  setM(){
    localStorage.setItem("mision", this.mision);
    alert("Cambios guardados exitosamente");
  }

}
