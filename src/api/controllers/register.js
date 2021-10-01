const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const pool = require('../../../db');
const jwtGenerator = require('../utils/jwtGenerator');

exports.addJobseeker = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { email, password, firstName, lastName } = req.body;
    const id = `jobseeker-${nanoid(16)}`;
    const resumeId = `resume-${nanoid(16)}`;

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

    await pool.query(
      'INSERT INTO resumes (resume_id, jobseeker_id) VALUES($1, $2) RETURNING *',
      [resumeId, id],
    );

    const accessToken = jwtGenerator.generateAccessToken(
      newJobseeker.rows[0].jobseeker_id,
    );
    const refreshToken = jwtGenerator.generateRefreshToken(
      newJobseeker.rows[0].jobseeker_id,
    );

    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [
      refreshToken,
    ]);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

exports.addEmployer = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, company, position } =
      req.body;
    const id = `employer-${nanoid(16)}`;

    const employer = await pool.query(
      'SELECT * FROM employers WHERE email = $1',
      [email],
    );

    if (employer.rows.length !== 0) {
      const err = new Error('Unauthenticated user');
      err.errorStatus = 401;
      err.message = 'Email is already used';
      throw err;
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newEmployer = await pool.query(
      `INSERT INTO employers (employer_id, email, password, first_name, last_name, company, position)
         VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, email, bcryptPassword, firstName, lastName, company, position],
    );

    const accessToken = jwtGenerator.generateAccessToken(
      newEmployer.rows[0].jobseeker_id,
    );
    const refreshToken = jwtGenerator.generateRefreshToken(
      newEmployer.rows[0].jobseeker_id,
    );

    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [
      refreshToken,
    ]);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
