const express = require('express');
const registerController = require('../controllers/register');

const router = express.Router();

router.post('/jobseeker', registerController.addJobseeker);
router.post('/employer', registerController.addEmployer);

module.exports = router;
