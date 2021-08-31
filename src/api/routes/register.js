const express = require('express');
const registerController = require('../controllers/register');

const router = express.Router();

router.post('/jobseeker', registerController.addJobseeker);

module.exports = router;
