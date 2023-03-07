var express = require('express');
var router = express.Router();
const auth_controller = require('../controllers/authController');
const message_controller = require('../controllers/messageController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.get('/create-message', message_controller.message_get);

router.post('/create-message', message_controller.message_post);

router.get('/sign-up', auth_controller.sign_up_get);

router.post('/sign-up', auth_controller.sign_up_post);

router.get('/login', auth_controller.login_get);

router.post('/login', auth_controller.login_post);

router.get('/log-out', auth_controller.logout_get);


module.exports = router;
