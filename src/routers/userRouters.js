const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { signupValidation, loginValidation } = require('../helper/validator');
const { isAuthorize } = require('../middleware/auth');

router.post('/user', signupValidation, userController.userCreate);
router.post('/login', loginValidation, userController.login);
router.get('/userList', isAuthorize, userController.userList);
// router.patch('/students/:id', studentController.studentsUpdate);
// router.delete('/students/:id', studentController.studentsDel);

module.exports = router;