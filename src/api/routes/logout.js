const express = require('express');
const pool = require('../../../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const deleteToken = await pool.query(
      'DELETE FROM authentications WHERE token = $1',
      [refreshToken],
    );
    if (!deleteToken.rowCount) {
      res.send('user logged out');
    }

    res.clearCookie('refreshToken').send('user logged out');
  } catch (error) {
    console.log('refresh token does not exist: ' + error);
  }
});

module.exports = router;
