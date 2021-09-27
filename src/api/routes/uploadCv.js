const express = require('express');
const uploadCvController = require('../controllers/uploadCv');

const router = express.Router();

router.post('/:id', uploadCvController.postCv);
router.get('/:id', uploadCvController.donwloadCv);

module.exports = router;
