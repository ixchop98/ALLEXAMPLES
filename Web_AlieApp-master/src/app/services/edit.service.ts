import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EditService{

	private createSourceMision = new Subject<any>();

	public getMisionText$ = this.createSourceMision.asObservable();

	setMis(mision){
		console.log(mision);
		this.createSourceMision.next(mision);
	}

}