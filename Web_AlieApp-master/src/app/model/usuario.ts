export class Usuario{

	constructor(
		public id: number,
		public nombre: string,
		public apellido: string,
		public password: string,
		public correo: string,
		public telefono: number,
		public foto: string,
		public genero: string,
		public fechaNacimiento: string,
		public fechaRegistro: string,
		public direccion: string,
		public username: string,
		public estado: number,
		public idRole: number,
		public nombreRol: string
	){}

}