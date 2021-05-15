'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get('/home', UserController.home);
router.post('/test', UserController.test);
router.post('/insertUser', UserController.InsertUser);
router.post('/loginUser', UserController.LoginUser);
router.post('/changePassword', UserController.ChangePassword);
router.post('/returnUser', UserController.ReturnedUser);
router.get('/getUsers', UserController.ReturnAllUser);
router.put('/updateUser', UserController.UpdateUser);
router.delete('/deleteUser/:id', UserController.DeleteUser);
router.put('/temporalUpdate', UserController.ChangeTemporal);
router.put('/updateProfile', UserController.UpdateProfile);

module.exports = router;