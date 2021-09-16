const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(202).send({ accessToken: req.accessToken });
});

module.exports = router;
