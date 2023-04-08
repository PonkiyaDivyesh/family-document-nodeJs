const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/students', studentController.studentsPost);
router.get('/students', studentController.studentsGet);
router.get('/students/:id', studentController.studentsGetSelect);
router.patch('/students/:id', studentController.studentsUpdate);
router.delete('/students/:id', studentController.studentsDel);

module.exports = router;