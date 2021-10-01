const express = require('express');
const applicationController = require('../controllers/application');

const router = express.Router();

router.post('/', applicationController.postApplication);
router.put('/', applicationController.putResponse);
router.get('/:id', applicationController.getByJobseekerId);
router.get('/detail/:id', applicationController.getByApplicationId);
router.get('/employer/:id', applicationController.getByEmployerId);

module.exports = router;
