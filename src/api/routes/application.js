const express = require('express');
const applicationController = require('../controllers/application');

const router = express.Router();

router.post('/', applicationController.postApplication);
router.put('/', applicationController.putResponse);
router.get('/:id', applicationController.getByJobseekerId);
router.delete('/:id', applicationController.deleteApplication);
router.get('/detail/:id', applicationController.getByApplicationId);
router.get('/employer/:id', applicationController.getByEmployerId);
router.post('/postInterview', applicationController.postInterview);
router.get('/getInterview/:id', applicationController.getInterview);
router.get('/getInterviewDetail/:id', applicationController.getInterviewById);

module.exports = router;
