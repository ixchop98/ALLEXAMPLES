CREATE TABLE Rol
(
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL
);

CREATE TABLE Disco
(
    id INTEGER PRIMARY KEY,
    tamano INTEGER NOT NULL
);

CREATE TABLE Bitacora(
    id INTEGER PRIMARY KEY
);

CREATE TABLE Accion(
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE Usuario
(
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    password VARCHAR(50) NOT NULL,
    correo VARCHAR(80) NOT NULL,
    telefono INTEGER,
    foto VARCHAR(200),
    genero VARCHAR(20),
    fechaNacimiento DATE NOT NULL,
    fechaRegistro DATE NOT NULL,
    direccion VARCHAR(50),
    username VARCHAR(60) NOT NULL,
    estado INTEGER,
    idRole INTEGER NOT NULL,
    FOREIGN KEY(idRole) REFERENCES Rol(id)
);

CREATE TABLE Particion
(
    id INTEGER PRIMARY KEY,
    tamano INTEGER NOT NULL,
    idDisco INTEGER NOT NULL,
    idBitacora INTEGER NOT NULL,
    FOREIGN KEY(idDisco) REFERENCES Disco(id),
    FOREIGN KEY(idBitacora) REFERENCES Bitacora(id)
);

CREATE TABLE Carpeta
(
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    idParticion INTEGER NOT NULL,
    idPadre INTEGER,
    idUsuario INTEGER NOT NULL,
    FOREIGN KEY(idParticion) REFERENCES Particion(id),
    FOREIGN KEY(idPadre) REFERENCES Carpeta(id),
    FOREIGN KEY(idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Particion_Usuario(
    idUser INTEGER,
    idParticion INTEGER,
    FOREIGN KEY(idUser) REFERENCES Usuario(id),
    FOREIGN KEY(idParticion) REFERENCES Particion(id)
);

CREATE TABLE Archivo
(
    id INTEGER PRIMARY KEY,
    contenido VARCHAR(1000),
    nombre VARCHAR(50) NOT NULL,
    idUser INTEGER NOT NULL,
    idCarpeta INTEGER NOT NULL,
    FOREIGN KEY(idUser) REFERENCES Usuario(id),
    FOREIGN KEY(idCarpeta) REFERENCES Carpeta(id)
);

CREATE TABLE Mensaje
(
    id INTEGER PRIMARY KEY,
    texto VARCHAR(500) NOT NULL,
    emisor INTEGER NOT NULL,
    receptor INTEGER NOT NULL,
    fecha TIMESTAMP NOT NULL,
    FOREIGN KEY(emisor) REFERENCES Usuario(id),
    FOREIGN KEY(receptor) REFERENCES Usuario(id)
);

CREATE TABLE Bitacora_Accion(
    idAccion INTEGER,
    idBitacora INTEGER,
    idUser INTEGER,
    fecha DATE,
    nombreCarpeta VARCHAR(50),
    FOREIGN KEY(idAccion) REFERENCES Accion(id),
    FOREIGN KEY(idBitacora) REFERENCES Bitacora(id),
    FOREIGN KEY(idUser) REFERENCES Usuario(id)
);

INSERT INTO Rol(id, nombre)
VALUES(1, 'administrador');
INSERT INTO Rol(id, nombre)
VALUES(2, 'root');
INSERT INTO Rol(id, nombre)
VALUES(3, 'cliente');

INSERT INTO Accion(id, nombre)
VALUES(1, 'Crear carpeta');
INSERT INTO Accion(id, nombre)
VALUES(2, 'Crear Archivo');
INSERT INTO Accion(id, nombre)
VALUES(3, 'Edición de archivo');
INSERT INTO Accion(id, nombre)
VALUES(4, 'Mover');
INSERT INTO Accion(id, nombre)
VALUES(5, 'Renombrar');


INSERT INTO Usuario(id, nombre, apellido, password, correo, telefono, genero, fechaNacimiento, fechaRegistro, direccion, username, estado, idRole)
VALUES(0, 'admin', 'admin', 'admin', 'admin@admin.com', 0, 'M', TO_DATE('22/08/1997', 'DD/MM/YYYY'), TO_DATE('22/08/1997', 'DD/MM/YYYY'), 'admon avenue', 'admin', 0, 1);

INSERT INTO Disco(id, tamano)
VALUES(0, 2048);
INSERT INTO Disco(id, tamano)
VALUES(1, 2048);

INSERT INTO Bitacora(id)
VALUES(0);

INSERT INTO Particion(id, tamano, idDisco, idBitacora)
VALUES(0, 1049, 0, 0);

INSERT INTO Carpeta(id, nombre, idParticion, idPadre, idUsuario)
VALUES(0, '/', 0, null, 0);

CREATE SEQUENCE sec_idUser
START WITH 1
MINVALUE 1
INCREMENT BY 1
ORDER;

CREATE SEQUENCE sec_idBitacora
START WITH 1
MINVALUE 1
INCREMENT BY 1
ORDER;

CREATE SEQUENCE sec_idParticion
START WITH 1
MINVALUE 1
INCREMENT BY 1
ORDER;

CREATE SEQUENCE sec_idCarpeta
START WITH 1
MINVALUE 1
INCREMENT BY 1
ORDER;

CREATE SEQUENCE sec_idArchivo
START WITH 1
MINVALUE 1
INCREMENT BY 1
ORDER;

DROP SEQUENCE sec_idArchivo;

CREATE OR REPLACE PROCEDURE insertUsers(wnombre in VARCHAR, wapellido in VARCHAR, wpassword in VARCHAR, wcorreo in VARCHAR, wtelefono in INTEGER,
wgenero in VARCHAR, wfechaNacimiento in DATE, wfechaRegistro in DATE, wdireccion in VARCHAR DEFAULT NULL, 
wusername in VARCHAR, westado in INTEGER, widRole in INTEGER)
AS
BEGIN
    INSERT INTO Bitacora(id)
    VALUES(sec_idBitacora.nextval);
    INSERT INTO Particion(id, tamano,idDisco, idBitacora)
    VALUES(sec_idParticion.nextval, 1048, 0, sec_idBitacora.currval);
   INSERT INTO Usuario(id, nombre, apellido, password, correo, telefono, genero, fechaNacimiento, fechaRegistro, direccion, username, estado, idRole)
   VALUES(sec_idUser.nextval, wnombre, wapellido, wpassword, wcorreo, wtelefono, wgenero, wfechaNacimiento, wfechaRegistro, wdireccion, wusername, westado, widRole);
       INSERT INTO Particion_Usuario(idUser, idParticion)
       VALUES(sec_idUser.currval, sec_idParticion.currval);
END;

EXECUTE insertUsers('admin', 'admin', 'admin', 'admin@admin.com', 0, 'sss', 'M', TO_DATE('22-08-1997', 'DD-MM-YYYY'), TO_DATE('07-11-2019', 'DD-MM-YYYY'), 'admon avenue', 'admin2', 0, 1);

CREATE OR REPLACE PROCEDURE updateUsers(varId in INTEGER, varNombre in VARCHAR, varApellido in VARCHAR, varPassword in VARCHAR, varCorreo in VARCHAR, varTelefono in INTEGER,
varDireccion in VARCHAR)
AS
BEGIN
    UPDATE Usuario
    SET nombre = varNombre, apellido = varApellido, password = varPassword, correo = varCorreo, telefono = varTelefono, direccion = varDireccion
    WHERE id = varId;
END;

CREATE OR REPLACE PROCEDURE deleteUsers(varId in INTEGER)
AS
BEGIN
    DELETE
    FROM Usuario
    WHERE id = varId;
END;

CREATE OR REPLACE FUNCTION nameFolderFather(idFather in INTEGER) return VARCHAR
IS
    str VARCHAR(50);
BEGIN
    SELECT nombre INTO str
    FROM Carpeta
    WHERE id = idFather;
    RETURN str;
END;

CREATE OR REPLACE PROCEDURE CreateNewFolder(varNombre in VARCHAR, varIdPadre in INTEGER, varIdUser in INTEGER, v_id OUT INTEGER)
IS
 var1 INTEGER;
 var2 INTEGER;
 var3 VARCHAR(50);
 V_FECHA DATE;
BEGIN 
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idParticion
    INTO var1
    FROM Particion_Usuario
    WHERE idUser = varIdUser;
    INSERT INTO Carpeta(id, nombre, idParticion, idUsuario, idPadre)
    VALUES(sec_idCarpeta.nextval, varNombre, var1, varIdUser, varIdPadre)
    RETURNING id into v_id;
    SELECT idBitacora INTO var2
    FROM Particion
    WHERE id = var1;
    var3 := nameFolderFather(varIdPadre);
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(1, var2, varIdUser, V_FECHA, var3);
END;

CREATE OR REPLACE PROCEDURE CreateNewFile(varContenido in VARCHAR, varNombre in VARCHAR, varIdUser in INTEGER, varIdCarpeta in INTEGER, v_id out INTEGER)
    IS
BEGIN
    INSERT INTO Archivo(id, contenido, nombre, idUser, idCarpeta)
    VALUES(sec_idArchivo.nextval, varContenido, varNombre, varIdUser, varIdCarpeta)
    RETURNING id into v_id;
END;

CREATE OR REPLACE PROCEDURE CreateCopyFile(varId in INTEGER, varNombre in VARCHAR, varIdUser in INTEGER, varIdCarpeta in INTEGER, v_id out INTEGER)
    IS
    var1 VARCHAR(1000);
BEGIN
    SELECT contenido INTO var1 FROM Archivo WHERE id = varId;
    INSERT INTO Archivo(id, contenido, nombre, idUser, idCarpeta)
    VALUES(sec_idArchivo.nextval, var1, varNombre, varIdUser, varIdCarpeta)
    RETURNING id into v_id;
END;

CREATE OR REPLACE TRIGGER NewFileBitacora
    AFTER INSERT ON Archivo
        FOR EACH ROW
            DECLARE 
            V_FECHA DATE;
            var1 INTEGER;
            var2 INTEGER;
            var3 VARCHAR(50);
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idParticion INTO var1 
    FROM Particion_Usuario
    WHERE idUser = :NEW.idUser;
    SELECT idBitacora INTO var2
    FROM Particion
    WHERE id = var1;
    SELECT nombre INTO var3
    FROM Carpeta
    WHERE id = :NEW.idCarpeta;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(2, var2, :NEW.idUser, V_FECHA, var3);
END;

CREATE OR REPLACE TRIGGER UpdateFileBitacora
    AFTER UPDATE OF contenido ON Archivo
FOR EACH ROW
    DECLARE
    V_FECHA DATE;
    var1 INTEGER;
    var2 INTEGER;
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idParticion INTO var1 FROM Particion_Usuario WHERE idUser = :OLD.idUser;
    SELECT idBitacora INTO var2 FROM Particion WHERE id = var1;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(3, var2, :OLD.idUser, V_FECHA, :OLD.nombre);
END;

CREATE OR REPLACE TRIGGER UpdateFileMoveBitacora
    AFTER UPDATE OF idCarpeta ON Archivo
FOR EACH ROW
    DECLARE
    V_FECHA DATE;
    var1 INTEGER;
    var2 INTEGER;
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idParticion INTO var1 FROM Particion_Usuario WHERE idUser = :OLD.idUser;
    SELECT idBitacora INTO var2 FROM Particion WHERE id = var1;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(4, var2, :OLD.idUser, V_FECHA, :OLD.nombre);
END;

CREATE OR REPLACE TRIGGER UpdateMoveFolder
    AFTER UPDATE OF idPadre ON Carpeta
FOR EACH ROW
    DECLARE
    V_FECHA DATE;
    var1 INTEGER;
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idBitacora INTO var1 FROM Particion WHERE id = :OLD.idParticion;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(4, var1, :OLD.idUsuario, V_FECHA, :OLD.nombre);
END;

CREATE OR REPLACE TRIGGER UpdateFileRenameBitacora
    AFTER UPDATE OF nombre ON Archivo
FOR EACH ROW
    DECLARE
    V_FECHA DATE;
    var1 INTEGER;
    var2 INTEGER;
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idParticion INTO var1 FROM Particion_Usuario WHERE idUser = :OLD.idUser;
    SELECT idBitacora INTO var2 FROM Particion WHERE id = var1;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(5, var2, :OLD.idUser, V_FECHA, :NEW.nombre);
END;


CREATE OR REPLACE TRIGGER UpdateRenameFolder
    AFTER UPDATE OF nombre ON Carpeta
FOR EACH ROW
    DECLARE
    V_FECHA DATE;
    var1 INTEGER;
BEGIN
    SELECT SYSDATE INTO V_FECHA FROM DUAL;
    SELECT idBitacora INTO var1 FROM Particion WHERE id = :OLD.idParticion;
    INSERT INTO Bitacora_Accion(idAccion, idBitacora, idUser, fecha, nombreCarpeta)
    VALUES(5, var1, :OLD.idUsuario, V_FECHA, :NEW.nombre);
END;

SELECT US.nombre, US.apellido, US.username, BA.nombreCarpeta, AC.nombre as Accion
FROM Bitacora_Accion BA
INNER JOIN Usuario US ON US.id = BA.idUser
INNER JOIN Accion AC ON AC.id = BA.idAccion
WHERE BA.nombreCarpeta = 'PruebaAngular' AND
BA.fecha >= TO_DATE('19-11-2019') AND BA.fecha <= TO_DATE('21-11-2019');

SELECT AC.nombre as Accion, US.nombre, US.apellido, BA.fecha, BA.nombreCarpeta
FROM Bitacora_Accion BA
INNER JOIN Accion AC ON AC.id = BA.idAccion
INNER JOIN Usuario US ON US.id = BA.idUser;

SELECT MAX(US.nombre), MAX(US.apellido), MAX(US.username), COUNT(*)
FROM Carpeta CP
INNER JOIN Usuario US ON US.id = CP.idUsuario
GROUP BY CP.idUsuario
WHERE trunc(US.fechaRegistro) = TO_DATE('22-08-2019');

SELECT US.nombre, COUNT(DISTINCT CP.id), COUNT(DISTINCT AR.id)
FROM Usuario US 
LEFT JOIN Carpeta CP ON CP.idUsuario = US.id
LEFT JOIN Archivo AR ON AR.idUser = US.id
WHERE trunc(US.fechaRegistro) = TO_DATE('18-11-2019')
GROUP BY US.id, US.nombre;

SELECT US.nombre, US.apellido, US.username
FROM Usuario US
INNER JOIN Carpeta CP ON CP.idUsuario = US.id
INNER JOIN Archivo AR ON AR.idUser = US.id
WHERE trunc(US.fechaRegistro) = TO_DATE('22-08-2019');

SELECT idParticion
FROM Particion_Usuario
WHERE idUser = 4;

SELECT nombre From Carpeta WHERE id = 1;

INSERT INTO Carpeta(id, nombre, idParticion, idUsuario, idPadre)
VALUES(100, 4, SELECT idParticion FROM Particion_Usuario WHERE idUser = 4, 4, null);

SELECT * FROM Bitacora_Accion;

SELECT * FROM Usuario;

SELECT TO_CHAR(fecharegistro, 'dd/mm/yyyy hh24:mi:ss') myDate FROM Usuario;

SELECT * FROM Usuario WHERE TO_CHAR(fechaNacimiento, 'YYYY') > 1994
ORDER BY TO_CHAR(fechaNacimiento, 'YYYY')DESC;

DELETE FROM Usuario WHERE id = 2;

SELECT * FROM Disco;
SELECT * FROM Particion_Usuario;
ALTER TABLE Particion 
ADD idBitacora INTEGER;
ALTER TABLE Bitacora_Accion
ADD nombreCarpeta VARCHAR(50);
ALTER TABLE Particion ADD CONSTRAINT FK_BITACORA FOREIGN KEY(idBitacora) REFERENCES Bitacora(id);
DROP TABLE Particion_Usuario;