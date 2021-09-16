const express = require('express');
const vacancyController = require('../controllers/vacancy');

const router = express.Router();

router.post('/', vacancyController.addVacancy);
router.post('/employer', vacancyController.getVacancyByEmployerId);
router.get('/', vacancyController.getVacancies);
router.get('/:id', vacancyController.getVacancyById);
router.put('/:id', vacancyController.updateVacancy);
router.delete('/:id', vacancyController.deleteVacancy);

module.exports = router;
