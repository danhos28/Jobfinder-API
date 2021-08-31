const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const pool = require('../../../db');
const jwtGenerator = require('../utils/jwtGenerator');

exports.addJobseeker = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { email, password, firstName, lastName } = req.body;
    const id = nanoid(16);

    const user = await pool.query('SELECT * FROM jobseekers WHERE email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Email is already used';
      throw err;
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newJobseeker = await pool.query(
      'INSERT INTO jobseekers (jobseeker_id, email, password, first_name, last_name) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [id, email, bcryptPassword, firstName, lastName],
    );

    const accessToken = jwtGenerator.generateAccessToken(
      newJobseeker.rows[0].id,
    );
    const refreshToken = jwtGenerator.generateRefreshToken(
      newJobseeker.rows[0].id,
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
