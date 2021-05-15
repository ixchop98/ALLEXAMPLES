'use strict'

var User = require('../models/user');
var db = require('../dao');
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var mailjet = require('node-mailjet').connect(
	process.env.MJ_APIKEY_PUBLIC,
	process.env.MJ_APIKEY_PRIVATE
);

var controller = {

	home: function(req, res){
		return res.status(200).send({
			message: 'Soy la home'
		});
	},

	test: function(req, res){
		return res.status(200).send({
			message: 'Soy test'
		});
	},

	InsertUser: function(req, res){
		var user = new User();
		user.nombre = req.body.nombre;
		user.apellido = req.body.apellido;
		user.password = req.body.password;
		user.correo = req.body.correo;
		user.telefono = req.body.telefono;
		user.genero = req.body.genero;
		user.fechaNacimiento = req.body.fechaNacimiento;
		user.fechaRegistro = req.body.fechaRegistro;
		user.direccion = req.body.direccion;
		user.username = req.body.username;
		user.estado = req.body.estado;
		user.idRole = req.body.idRole;
		var sub = req.body.subject;
		var comp = req.body.compl;
		oracledb.getConnection(
		db,
		(err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexion'
				});
			}else{
				console.log("Conexion establecida");
				cn.execute(
					`BEGIN
					 insertUsers(:nombre, :apellido, :password, :correo, :telefono, :genero, TO_DATE(:fechaNacimiento, 'DD-MM-YYYY'), TO_DATE(:fechaRegistro, 'DD-MM-YYYY HH24:MI:SS'), :direccion, :username, :estado, :idRole);
					 END;`,
					{
						nombre: user.nombre,
						apellido: user.apellido,
						password: user.password,
						correo: user.correo,
						telefono: user.telefono,
						genero: user.genero,
						fechaNacimiento: user.fechaNacimiento,
						fechaRegistro: user.fechaRegistro,
						direccion: user.direccion,
						username: user.username,
						estado: user.estado,
						idRole: user.idRole
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al insertar Usuario'
							});
						}else{
							if(!result){
								res.status(404).send({message: 'No se ha podido insertar el usuario'});	
							}else{
								console.log(result);
								mailjet.post('send', { version: 'v3.1' }).request({
									Messages:[{
										From:{
											Email: 'normalhak@gmail.com',
											Name: 'Alie-app',
										},
										To:[
											{
												Email: user.correo,
												Name: user.nombre
											}
										],
										Subject: sub,
										HTMLPart: 'Hola ' + user.nombre + ', <h3>Su contraseña temporal es: ' + user.password + ' </h3><br>' + 
													comp
									}
									]
								}).then((result) => {
									res.status(200).send({
										message: 'Usuario registrado correctamente',
										body: result.body
									});
								}).catch((err) => {
									res.status(500).send({
										Error: err.ErrorMessage
									});
								});
							}
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						}); 
					} 
				); 
			}
		});
	},

	LoginUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexion'
				});
			}else{
				console.log("Conexion establecida");
				cn.execute(
					`SELECT id, nombre, apellido, correo, foto, TO_CHAR(fechaRegistro, 'dd-mm-yyyy hh24:mi:ss') fechaRegistro, username, estado, idRole FROM Usuario 
					WHERE username = :username AND password = :password`,
					[
						req.body.username,
						req.body.password
					],
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							if(result.rows.length){
								res.status(200).send({
									user: result.rows
								});
							}else{
								res.status(200).send({
									user: 0
								});
							}
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	},

	ChangePassword: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexion'
				});
			}else{
				cn.execute(
					`UPDATE Usuario
					SET password = :password, estado = :estado
					WHERE id = :id`,
					{
						password: req.body.password,
						estado: req.body.estado,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							res.status(200).send({
								rowsAffected: result.rowsAffected
							});
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	},

	ReturnedUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexion'
				});
			}else{
				cn.execute(
					`SELECT id, nombre, apellido, correo, foto, TO_CHAR(fechaRegistro, 'dd-mm-yyyy hh24:mi:ss') fechaRegistro, username, direccion, telefono, password, estado, idRole FROM Usuario 
					WHERE id = :id`,
					{
						id: req.body.id
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							if(result.rows.length){
								res.status(200).send({
									user: result.rows
								});
							}else{
								res.status(200).send({
									user: 0
								});
							}
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}	
		});
	},

	ReturnAllUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT us.id, us.nombre, us.apellido, us.direccion, us.telefono, us.username, us.correo, rl.nombre AS NombreRol
					 FROM Usuario us
					 INNER JOIN Rol rl ON us.idRole = rl.id`,
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							res.status(200).send({
								users: result.rows
							});
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	},

	UpdateUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`BEGIN
					 updateUsers(:id ,:nombre, :apellido, :password, :correo, :telefono, :direccion);
					 END;`,
					{
						id: req.body.id,
						nombre: req.body.nombre,
						apellido: req.body.apellido,
						password: req.body.password,
						correo: req.body.correo,
						telefono: req.body.telefono,
						direccion: req.body.direccion			
					},
					{
						autoCommit: true
					},
					(err, result) =>{
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							res.status(200).send({
								message: 'Usuario actualizado correctamente' 
							});
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	},

	DeleteUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`BEGIN
					 deleteUsers(:id);
					 END;`,
					{
						id: req.params.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							res.status(200).send({
								message: 'Usuario eliminado correctamente'
							});
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	},

	ChangeTemporal: function(req, res){
		var name = req.body.name;
		var correo = req.body.correo;
		let password = req.body.password;
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Usuario
					SET password = :password, fechaRegistro = TO_DATE(:fechaRegistro, 'DD-MM-YYYY HH24:mi:ss')
					WHERE id = :id`,
					{
						password: password,
						id: req.body.id,
						fechaRegistro: req.body.fechaRegistro
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error en el servidor'
							});
						}else{
							mailjet.post('send', { version: 'v3.1' }).request({
									Messages:[{
										From:{
											Email: 'normalhak@gmail.com',
											Name: 'Alie-app',
										},
										To:[
											{
												Email: correo,
												Name: name
											}
										],
										Subject: 'Confirmación de correo',
										HTMLPart: 'Hola ' + name + ', <h3>Su contraseña temporal es: ' + password + ' </h3><br>' + 
													'Tiene 1 minuto para ingresar con su contraseña temporal'
									}
									]
								}).then((result) => {
									res.status(200).send({
										message: 'Usuario actualizado correctamente',
										body: result.body
									});
								}).catch((err) => {
									res.status(500).send({
										Error: err.ErrorMessage
									});
							});
						}
					}
				);
			}
		});
	},

	UpdateProfile: function(req, res){
		console.log(req);
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Usuario
					SET nombre = :nombre, apellido = :apellido, password = :password, correo = :correo, foto = :foto, telefono = :telefono, direccion = :direccion
					WHERE id = :id`,
					{
						id: req.body.id,
						nombre: req.body.nombre,
						apellido: req.body.apellido,
						password: req.body.password,
						correo: req.body.correo,
						foto: req.body.foto,
						telefono: req.body.telefono,
						direccion: req.body.direccion
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al actualizar el usuario'
							});
						}else{
							res.status(200).send({
								rowsAffected: result.rowsAffected
							});
						}
						cn.release((err) => {
							if(err) console.log(err.message);
						});
					}
				);
			}
		});
	}

}

module.exports = controller;