'use strict'

var express = require('express');
var EdicionController = require('../controllers/edicion');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './img' });

router.post('/uploadLogo', multipartMiddleware, EdicionController.UploadLogo);
router.get('/get-image/:image', EdicionController.GetLogo);
router.get('/get-video/:video', EdicionController.GetVideo);

module.exports = router;