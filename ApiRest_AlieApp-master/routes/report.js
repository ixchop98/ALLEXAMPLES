'use strict'

var express = require('express');
var ReportController = require('../controllers/reporte');

var router = express.Router();

router.post('/SearchYear', ReportController.SearchYear);
router.post('/SearchModify', ReportController.SearchModify);
router.get('/getBitacora', ReportController.GetBitacora);
router.get('/getFilesForUser/:fecha', ReportController.GetUsersFiles);

module.exports = router;