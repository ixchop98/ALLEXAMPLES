'use strict'

var controller = {

	SaveVideoServer: function(req, res){
		var fileName = "No subida";
		if(req.files){
			var filePath = req.files.video.path;
			var fileSplit = filePath.split('/');
			var fileName = fileSplit[1];	
			return res.status(200).send({
				video: fileName
			});
		}else{
			return res.status(200).send({
				message: fileName
			});
		}
	}

}

module.exports = controller;