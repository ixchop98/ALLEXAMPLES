'use strict'

var db = require('../dao');
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var mailjet = require('node-mailjet').connect(
	process.env.MJ_APIKEY_PUBLIC,
	process.env.MJ_APIKEY_PRIVATE
);

var controller = {
	Prb: function(req,res){
		console.log(req.body);
		return res.status(200).send({
			message: 'Post hecho'
		});
	},
	AllFoldersUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT id, nombre, idPadre 
					FROM Carpeta
					WHERE idUsuario = :id OR id = 0`,
					{
						id: req.params.id
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al seleccionar carpetas'
							});
						}else{
							if(result.rows.length){
								res.status(200).send({
									folder: result.rows
								});
							}else{
								res.status(200).send({
									folder: 0
								});
							}
							cn.release((err) => {
								if(err) console.log(err.message);
							});
						}
					}
				);
			}
		});
	},

	AllFilesUser: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT * FROM Archivo
					WHERE idUser = :id`,
					{
						id: req.params.id
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al cargar archivos'
							});
						}else{
							if(result.rows.length){
								res.status(200).send({
									file: result.rows
								});
							}else{
								res.status(200).send({
									file: 0
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

	CreateNewFolder: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`BEGIN
					CreateNewFolder(:nombre, :idPadre, :idUser, :v_id);
					END;`,
					{
						nombre: req.body.nombre,
						idPadre: req.body.idPadre,
						idUser: req.body.idUser,
						v_id: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al insertar carpeta'
							});
						}else{
							res.status(200).send({
								data: result.outBinds
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

	CreateNewFile: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`BEGIN
						CreateNewFile(:contenido, :nombre, :idUser, :idCarpeta, :v_id);
					END;`,
					{
						contenido: req.body.contenido,
						nombre: req.body.nombre,
						idUser: req.body.idUser,
						idCarpeta: req.body.idCarpeta,
						v_id: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al insertar Archivo'
							});
						}else{
							res.status(200).send({
								data: result.outBinds
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

	AllFolders: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conxeión'
				});
			}else{
				cn.execute(
					`SELECT id, nombre, idPadre
					FROM Carpeta`,
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al cargar carpetas'
							});
						}else{
							res.status(200).send({
								folders: result.rows
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

	AllFiles: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexion'
				});
			}else{
				cn.execute(
					`SELECT id, nombre, idCarpeta
					FROM Archivo`,
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al cargar archivos'
							});
						}else{
							res.status(200).send({
								files: result.rows
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

	GetContentFile: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT contenido FROM Archivo WHERE id = :id`,
					{
						id: req.params.id
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al cargar contenido de archivo'
							});
						}else{
							res.status(200).send({
								contenido: result.rows[0]
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

	UpdateContentFile: function(req, res){
		let correo = req.body.correo;
		let nombre = req.body.nombre + " " + req.body.apellido;
		let nombreArchivo = req.body.nombreArchivo;
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Archivo
					SET contenido = :contenido
					WHERE id = :id`,
					{
						contenido: req.body.contenido,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al actualizar archivo'
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
												Name: nombre
											}
										],
										Subject: 'Cambios en Archivo',
										HTMLPart: 'Hola ' + nombre + ', se han hecho cambios en el siguiente archivo: ' + nombreArchivo
									}
									]
								}).then((result) => {
									res.status(200).send({
										message: 'Archivo actualizado correctamente',
										body: result.body
									});
								}).catch((err) => {
									res.status(500).send({
										Error: err.ErrorMessage
									});
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

	MoveFile: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Archivo
					SET idCarpeta = :idCarpeta
					WHERE id = :id`,
					{
						idCarpeta: req.body.idCarpeta,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al mover archivo'
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

	MoveFolder: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Carpeta
					SET idPadre = :idPadre
					WHERE id = :id`,
					{
						idPadre: req.body.idPadre,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al mover carpeta'
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

	UpdateNameFile: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Archivo
					SET nombre = :nombre
					WHERE id = :id`,
					{
						nombre: req.body.nombre,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Erro al renombrar archivo'
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

	UpdateNameFolder: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`UPDATE Carpeta
					SET nombre = :nombre
					WHERE id = :id`,
					{
						nombre: req.body.nombre,
						id: req.body.id
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Erro al renombrar carpeta'
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

	GetFoldersToCopy: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Erorr de conexión'
				});
			}else{
				cn.execute(
					`SELECT id, nombre
					FROM Carpeta
					WHERE id != :id AND idUsuario = :idUsuario`,
					{
						id: req.body.id,
						idUsuario: req.body.idUsuario
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al seleccionar carpetas'
							});
						}else{
							res.status(200).send({
								carpeta: result.rows
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

	CopyFile: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`BEGIN
					CreateCopyFile(:id, :nombre, :idUser, :idCarpeta, :v_id);
					END;`,
					{
						id: req.body.id,
						nombre: req.body.nombre,
						idUser: req.body.idUser,
						idCarpeta: req.body.idCarpeta,
						v_id: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
					},
					{
						autoCommit: true
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al insertar Archivo'
							});
						}else{
							res.status(200).send({
								data: result.outBinds
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