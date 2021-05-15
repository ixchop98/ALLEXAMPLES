import { Component } from '@angular/core';
import { Subscription }   from 'rxjs';
import { Router } from '@angular/router';

import { TransferService } from './services/transfer.service';

import { Usuario } from './model/usuario';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TransferService]
})
export class AppComponent  {

  	title = 'Alie-StoreApp';
  	public usuario: Usuario;
  	public imageUrl: string = "logo.png";
  	public url: string;

  	RedirectToHome(){
  		this._router.navigate(['/home']);
  	}

	constructor(
		private _transferService: TransferService,
		private _router: Router
	){
		this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null);
		localStorage.setItem("user", JSON.stringify(this.usuario));
		localStorage.setItem("mision", `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`);
		localStorage.setItem("vision", `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`);
		localStorage.setItem("sobreMi", `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`);
		localStorage.setItem("video", "naturaleza.mp4");	
		this._transferService.createSource$.subscribe(
			result => {
				this.usuario = result;
			}
		);
		this._transferService.imageSource$.subscribe(
			result => {
				this.imageUrl = result;
			}
		);
		this.url = 'http://localhost:3700/api';
	}

	Logout(){
		let logUser = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null);
		this.usuario = logUser;
		localStorage.setItem("user", JSON.stringify(logUser));
		this.RedirectToHome();
	}

}
