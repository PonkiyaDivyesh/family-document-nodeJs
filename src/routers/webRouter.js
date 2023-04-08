const express = require('express');
const user_router = express();

user_router.set('view engine', 'ejs');
user_router.set('views', './views');
user_router.use(express.static('public'));

const userController = require('../controllers/userController');

user_router.get('/mail-verification', userController.verifyMail);

module.exports = user_router;