'use strict'

var express = require('express');
var ArchivosController = require('../controllers/archivos');

var router = express.Router();

router.get('/getFoldersUser/:id', ArchivosController.AllFoldersUser);
router.get('/getFilesUser/:id', ArchivosController.AllFilesUser);
router.post('/createNewFolder', ArchivosController.CreateNewFolder);
router.post('/createNewFile', ArchivosController.CreateNewFile);
router.get('/getAllFolders', ArchivosController.AllFolders);
router.get('/getAllFiles', ArchivosController.AllFiles);
router.get('/getContentFile/:id', ArchivosController.GetContentFile);
router.put('/updateContentFile', ArchivosController.UpdateContentFile);
router.put('/updateMoveFile', ArchivosController.MoveFile);
router.put('/updateMoveFolder', ArchivosController.MoveFolder);
router.put('/updateNameFile', ArchivosController.UpdateNameFile);
router.put('/updateNameFolder', ArchivosController.UpdateNameFolder);
router.post('/GetFoldersToCopy', ArchivosController.GetFoldersToCopy);
router.post('/CopyNewFile', ArchivosController.CopyFile);

router.post('/prb', ArchivosController.Prb);

module.exports = router;