const express = require('express');
const savejobsConttoller = require('../controllers/savejobs');

const router = express.Router();

router.post('/', savejobsConttoller.addSaveJob);
router.get('/:id', savejobsConttoller.getSaveJob);
router.post('/delete', savejobsConttoller.deleteSaveJob);

module.exports = router;
