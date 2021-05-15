import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HomeService{

	private createSoureMision = new Subject<any>();

	public misionObs$ = this.createSoureMision.asObservable();

	viewMision(pp){
		this.createSoureMision.next(pp);
	}

}

