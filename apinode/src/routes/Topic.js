const { Router } = require('express');
const router = Router();
const TopicController = require('../controllers/TopicController');
const authMiddleware = require('../middlewares/auth');      //MIDDLEWARE DE AUTENTICACION

//RUTA PARA CREAR UN TOPIC
router.post('/create', authMiddleware.auth, TopicController.create);

//RUTA PARA TRAER TODOS LOS TOPICS
router.get('/get-topics/:page?', TopicController.getAll);

//RUTA PARA CAR TOPICS POR USUARIO
router.get('/get-topic-user/:id', TopicController.getByUser);

//SACAR UN TOPIC POR ID
router.get('/get-topic/:id', TopicController.getById);

//ACTUALIZAR UN TOPIC
router.put('/update/:id', authMiddleware.auth, TopicController.update);

//ELIMINAR UN TOPIC
router.delete('/delete/:id', authMiddleware.auth, TopicController.delete);

//BUSCAR TOPICS POR COINCIDENCIA
router.get('/search/:coincidence', TopicController.search);

module.exports = router;