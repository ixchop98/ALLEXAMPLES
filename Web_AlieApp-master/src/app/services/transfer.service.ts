import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TransferService{

	private createUserSource = new Subject<any>();
	private imageSource = new Subject<any>();

	public createSource$ = this.createUserSource.asObservable();
	public imageSource$ = this.imageSource.asObservable();

	createUserLogin(user){
		this.createUserSource.next(user);
	}

	sendImageName(name){
		this.imageSource.next(name.image);
	}

}