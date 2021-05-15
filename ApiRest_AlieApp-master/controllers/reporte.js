'use strict'

var db = require('../dao');
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

var controller = {

	SearchYear: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: "Error de conexion"
				});
			}else{
				cn.execute(
					`SELECT us.id, us.nombre, us.apellido, us.correo, us.telefono, us.foto, TO_CHAR(us.fechaRegistro, 'dd-mm-yyyy') fechaRegistro, TO_CHAR(us.fechaNacimiento, 'dd-mm-yyyy') fechaNacimiento, us.username, r.nombre AS nombreRol 
					FROM Usuario us
					INNER JOIN Rol r ON us.idRole = r.id
					WHERE TO_CHAR(us.fechaNacimiento, 'YYYY') > :fecha
					ORDER BY TO_CHAR(us.fechaNacimiento, 'YYYY')ASC`,
					{
						fecha: req.body.fecha
					},
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

	SearchModify: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Erro de conexión'
				});
			}else{
				cn.execute(
					`SELECT US.nombre, US.apellido, US.username, BA.nombreCarpeta, AC.nombre as Accion
						FROM Bitacora_Accion BA
						INNER JOIN Usuario US ON US.id = BA.idUser
						INNER JOIN Accion AC ON AC.id = BA.idAccion
						WHERE BA.nombreCarpeta = :nombreCarpeta AND
						BA.fecha >= TO_DATE(:fechaInicial) AND BA.fecha <= TO_DATE(:fechaFinal)`,
					{
						nombreCarpeta: req.body.nombreCarpeta,
						fechaInicial: req.body.fechaInicial,
						fechaFinal: req.body.fechaFinal
					},
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

	GetBitacora: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT AC.nombre as Accion, US.nombre, US.apellido, TO_CHAR(BA.fecha, 'DD-MM-YYYY') fecha, BA.nombreCarpeta
						FROM Bitacora_Accion BA
						INNER JOIN Accion AC ON AC.id = BA.idAccion
						INNER JOIN Usuario US ON US.id = BA.idUser`,
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al recuperar bitacora'
							});
						}else{
							res.status(200).send({
								bit: result.rows
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

	GetUsersFiles: function(req, res){
		oracledb.getConnection(db, (err, cn) => {
			if(err){
				console.log(err.message);
				return res.status(500).send({
					message: 'Error de conexión'
				});
			}else{
				cn.execute(
					`SELECT US.nombre, US.apellido, US.username, COUNT(DISTINCT CP.id) as carpetas, COUNT(DISTINCT AR.id) as archivos
					FROM Usuario US 
					LEFT JOIN Carpeta CP ON CP.idUsuario = US.id
					LEFT JOIN Archivo AR ON AR.idUser = US.id
					WHERE trunc(US.fechaRegistro) = TO_DATE(:fecha)
					GROUP BY US.id, US.nombre, US.apellido, US.username`,
					{
						fecha: req.params.fecha
					},
					(err, result) => {
						if(err){
							console.log(err.message);
							res.status(500).send({
								message: 'Error al recuperar usuarios'
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
	}

}

module.exports = controller;