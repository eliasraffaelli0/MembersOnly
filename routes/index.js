var express = require('express');
var router = express.Router();
const auth_controller = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/sign-up', auth_controller.sign_up_get);

router.post('/sign-up', auth_controller.sign_up_post);

router.get('/login', auth_controller.login_get);


module.exports = router;
