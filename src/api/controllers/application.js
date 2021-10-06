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
      `SELECT applications.application_id, applications.response, applications.applied_at, vacancies.* FROM applications INNER JOIN
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

exports.postInterview = async (req, res, next) => {
  try {
    const {
      application_id,
      employer_id,
      jobseeker_id,
      interviewer,
      type,
      datetime,
      link,
      notes,
      job_title,
      company,
    } = req.body;
    const interview_id = `interview-${nanoid(16)}`;
    const response = 'ACCEPT';

    const interview = await pool.query(
      `INSERT INTO interviews VALUES($1,$2,$3,$4,$5,$6,$7,$8, $9, $10, $11) RETURNING *`,
      [
        interview_id,
        application_id,
        employer_id,
        jobseeker_id,
        interviewer,
        type,
        datetime,
        link,
        notes,
        job_title,
        company,
      ],
    );

    await pool.query(
      'UPDATE applications SET response = $1 WHERE application_id = $2',
      [response, application_id],
    );

    if (!interview.rows[0].interview_id) {
      const err = new Error('Bad Request');
      err.errorStatus = 400;
      err.message = 'Post interview failed';
      throw err;
    }

    res.json({
      message: 'Schedule for interview has been successfully posted',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interview = await pool.query(
      `SELECT interviews.*, employers.first_name, employers.last_name,
    jobseekers.first_name, jobseekers.last_name, jobseekers.phone_number, jobseekers.email FROM interviews
    INNER JOIN employers ON interviews.employer_id = employers.employer_id
    INNER JOIN jobseekers ON interviews.jobseeker_id = jobseekers.jobseeker_id
    WHERE interviews.employer_id = $1 ORDER BY interviews.datetime`,
      [id],
    );

    if (!interview.rows[0]) {
      const err = new Error('Not found');
      err.errorStatus = 404;
      err.message = 'Schedule not found';
      throw err;
    }

    res.json({ data: interview.rows });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interview = await pool.query(
      `SELECT interviews.*, employers.first_name, employers.last_name FROM interviews
    INNER JOIN employers ON interviews.employer_id = employers.employer_id
    INNER JOIN applications ON interviews.application_id = applications.application_id
    WHERE interviews.application_id = $1`,
      [id],
    );

    if (!interview.rows[0]) {
      const err = new Error('Not found');
      err.errorStatus = 404;
      err.message = 'Schedule not found';
      throw err;
    }

    res.json(interview.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM applications WHERE application_id = $1', [
      id,
    ]);
    res.status(200).send('applcation deleted');
  } catch (error) {
    console.log(error);
    next(error);
  }
};
