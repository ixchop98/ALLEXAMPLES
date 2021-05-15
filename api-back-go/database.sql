CREATE DATABASE db_chat_golang;
USE db_chat_golang;

CREATE TABLE Role(
	id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT pk_role PRIMARY KEY(id)
)ENGINE=InnoDB;

CREATE TABLE User(
	id INT UNSIGNED AUTO_INCREMENT,
    role_id INT UNSIGNED NOT NULL,
    username VARCHAR(300) NOT NULL,
    password VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT pk_user PRIMARY KEY(id),
    CONSTRAINT uq_username UNIQUE(username),
    CONSTRAINT fk_user_role FOREIGN KEY(role_id) REFERENCES Role(id) 
)ENGINE=InnoDB;

CREATE TABLE Message(
	id INT UNSIGNED AUTO_INCREMENT,
    receiver INT UNSIGNED NOT NULL,
    sender INT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    CONSTRAINT pk_message PRIMARY KEY(id),
    CONSTRAINT fk_message_receiver FOREIGN KEY(receiver) REFERENCES User(id),
    CONSTRAINT fk_message_sender FOREIGN KEY(sender) REFERENCES User(id)
)ENGINE=InnoDB;

INSERT INTO Role(name, created_at)
VALUES('USER', UTC_TIMESTAMP());
INSERT INTO Role(name, created_at)
VALUES('INVITADO', UTC_TIMESTAMP());
