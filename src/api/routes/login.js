const express = require('express');
const loginController = require('../controllers/login');

const router = express.Router();

router.post('/', loginController.postLogin);
router.post('/employer', loginController.postLoginEmployer);

module.exports = router;
