var express = require('express');
var router = express.Router();
const auth_controller = require('../controllers/authController');
const message_controller = require('../controllers/messageController')

router.get('/', message_controller.messages_get);

router.get('/create-message', message_controller.message_create_get);

router.post('/create-message', message_controller.message_post);

router.post('/delete-message/:id', message_controller.message_delete_post);

router.get('/sign-up', auth_controller.sign_up_get);

router.post('/sign-up', auth_controller.sign_up_post);

router.get('/login', auth_controller.login_get);

router.post('/login', auth_controller.login_post);

router.get('/log-out', auth_controller.logout_get);


module.exports = router;
