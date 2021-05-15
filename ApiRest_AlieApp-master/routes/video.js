'use strict'

var express = require('express');
var VideoController = require('../controllers/video');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './video' });

router.post('/uploadVideo', multipartMiddleware, VideoController.SaveVideoServer);

module.exports = router;