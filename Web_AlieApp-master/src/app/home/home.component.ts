import { Component, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit{

  public mision: string;
	public vision: string;
	public sobreMi: string;
  public video: string;
  public url: string;

  	constructor(
  	) {
      this.url = 'http://localhost:3700/api';
  	}

  	ngOnInit() {
      this.mision = localStorage.getItem("mision");
      this.vision = localStorage.getItem("vision");
      this.sobreMi = localStorage.getItem("sobreMi");
      this.video = localStorage.getItem("video");
  	}

}
