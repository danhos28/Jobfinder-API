const bcrypt = require('bcrypt');
const pool = require('../../../db');
const jwtGenerator = require('../utils/jwtGenerator');

exports.postLogin = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { email, password } = req.body;
    const jobseeker = await pool.query(
      'SELECT * FROM jobseekers WHERE email = $1',
      [email],
    );

    if (jobseeker.rows.length === 0) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Password or Email is incorrect';
      throw err;
    }

    const validPassword = await bcrypt.compare(
      password,
      jobseeker.rows[0].password,
    );

    if (!validPassword) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Password or Email is incorrect';
      throw err;
    }

    const accessToken = jwtGenerator.generateAccessToken(
      jobseeker.rows[0].jobseeker_id,
      jobseeker.rows[0].first_name,
    );
    const refreshToken = jwtGenerator.generateRefreshToken(
      jobseeker.rows[0].jobseeker_id,
      jobseeker.rows[0].first_name,
    );

    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [
      refreshToken,
    ]);

    res
      .cookie('refreshToken', refreshToken, {
        sameSite: 'strict',
        path: './',
        expires: new Date(new Date().getTime() + 604800 * 1000 * 2),
        httpOnly: true,
      })
      .json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

exports.postLoginEmployer = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { email, password } = req.body;
    const employer = await pool.query(
      'SELECT * FROM employers WHERE email = $1',
      [email],
    );

    if (employer.rows.length === 0) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Password or Email is incorrect';
      throw err;
    }

    const validPassword = await bcrypt.compare(
      password,
      employer.rows[0].password,
    );

    if (!validPassword) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Password or Email is incorrect';
      throw err;
    }

    const accessToken = jwtGenerator.generateAccessToken(
      employer.rows[0].employer_id,
      employer.rows[0].first_name,
    );
    const refreshToken = jwtGenerator.generateRefreshToken(
      employer.rows[0].employer_id,
      employer.rows[0].first_name,
    );

    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [
      refreshToken,
    ]);

    res
      .cookie('refreshToken', refreshToken, {
        sameSite: 'strict',
        expires: new Date(new Date().getTime() + 604800 * 1000 * 2),
        httpOnly: true,
      })
      .json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
