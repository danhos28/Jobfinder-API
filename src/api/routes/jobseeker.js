const express = require('express');
const jobseekerController = require('../controllers/jobseeker');

const router = express.Router();

router.get('/:id', jobseekerController.getJobseekerById);
router.get('/profilePic/:key', jobseekerController.getProfilePic);
router.put('/:id', jobseekerController.editJobseeker);
router.post('/picture/:id', jobseekerController.postPicture);
router.get('/picture/remove/:id', jobseekerController.removeProfilepic);

module.exports = router;
