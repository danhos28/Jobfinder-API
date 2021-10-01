const { nanoid } = require('nanoid');
const pool = require('../../../db');

exports.postApplication = async (req, res, next) => {
  try {
    const id = `application-${nanoid(16)}`;
    const { vacancy_id, jobseeker_id, message } = req.body;
    const response = 'PENDING';
    const applied_at = new Date(Date.now()).toISOString();

    const addApplication = await pool.query(
      'INSERT INTO applications VALUES($1, $2, $3, $4, $5, $6) RETURNING * ',
      [id, jobseeker_id, vacancy_id, message, response, applied_at],
    );

    if (!addApplication.rows[0].application_id) {
      const err = new Error('Bad Request');
      err.errorStatus = 400;
      err.message = 'Add application failed';
      throw err;
    }

    res.json({ message: 'Successfully applied' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getByJobseekerId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getApplication = await pool.query(
      `SELECT applications.response, applications.applied_at, vacancies.* FROM applications INNER JOIN
      vacancies ON applications.vacancy_id = vacancies.vacancy_id WHERE jobseeker_id = $1`,
      [id],
    );

    if (!getApplication.rowCount) {
      const err = new Error('Bad Request');
      err.errorStatus = 400;
      err.message = 'Get application failed';
      throw err;
    }

    res.status(200).json({ message: 'success', data: getApplication.rows });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getByEmployerId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getApplication = await pool.query(
      `select applications.application_id, applications.message, applications.applied_at, applications.response,
      vacancies.vacancy_id, vacancies.job_title, jobseekers.jobseeker_id, jobseekers.first_name, jobseekers.last_name,
       jobseekers.email, jobseekers.phone_number, jobseekers.profile_picture FROM applications
      INNER JOIN vacancies ON applications.vacancy_id = vacancies.vacancy_id INNER JOIN jobseekers
      ON applications.jobseeker_id = jobseekers.jobseeker_id WHERE vacancies.employer_id = $1 ORDER BY vacancies.job_title`,
      [id],
    );

    if (!getApplication.rowCount) {
      const err = new Error('Bad Request');
      err.errorStatus = 400;
      err.message = 'Get application failed';
      throw err;
    }

    res.status(200).json({ message: 'success', data: getApplication.rows });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.putResponse = async (req, res, next) => {
  try {
    const { application_id, response } = req.body;

    await pool.query(
      'UPDATE applications SET response = $1 WHERE application_id = $2',
      [response, application_id],
    );

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getByApplicationId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const detailApplication = await pool.query(
      `SELECT vacancies.*, jobseekers.*, applications.* FROM applications
    INNER JOIN vacancies ON applications.vacancy_id = vacancies.vacancy_id INNER JOIN jobseekers ON applications.jobseeker_id =
    jobseekers.jobseeker_id WHERE applications.application_id = $1`,
      [id],
    );

    res.status(200).json(detailApplication.rows[0]);
  } catch (error) {
    next(error);
  }
};
