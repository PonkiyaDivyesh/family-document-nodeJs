const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { signupValidation, loginValidation } = require('../helper/validator');

router.post('/user', signupValidation, userController.userCreate);
router.get('/login', loginValidation, studentController.login);
// router.get('/students/:id', studentController.studentsGetSelect);
// router.patch('/students/:id', studentController.studentsUpdate);
// router.delete('/students/:id', studentController.studentsDel);

module.exports = router;