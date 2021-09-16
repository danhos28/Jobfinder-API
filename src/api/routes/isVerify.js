const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    res.status(200).json({
      jobseeker: req.jobseeker,
      newAccessToken: req.accessToken,
      status: req.status,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
