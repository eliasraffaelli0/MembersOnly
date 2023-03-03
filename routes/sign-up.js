const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/authController');

router.get('/', auth_controller.sign_up_get);

router.post('/', auth_controller.sign_up_post);

router.get('/login', auth_controller.login_get);


module.exports = router;