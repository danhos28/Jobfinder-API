const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const pool = require('../../../db');

exports.addVacancy = async (req, res, next) => {
  try {
    const {
      employer_id,
      job_title,
      job_desc,
      job_qualifications,
      job_notes,
      job_level,
      job_educationReq,
      company,
      company_about,
      salary,
      employment_type,
      category,
      job_location,
    } = req.body;

    let image = '';
    if (req.file) {
      image = req.file.filename;
    }

    const id = `vacancy-${nanoid(16)}`;
    const createAt = new Date(Date.now()).toISOString();

    const newVacancy = await pool.query(
      `INSERT INTO vacancies VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        id,
        employer_id,
        job_title,
        job_desc,
        job_qualifications,
        job_notes,
        job_level,
        job_educationReq,
        company,
        company_about,
        salary,
        employment_type,
        category,
        job_location,
        image,
        createAt,
      ],
    );

    if (!newVacancy.rows[0].vacancy_id) {
      const err = new Error('Bad Request');
      err.errorStatus = 400;
      err.message = 'Add vacancy failed';
      throw err;
    }

    res.json({ message: 'Vacancy successfully added' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getVacancies = async (req, res, next) => {
  try {
    const vacancies = await pool.query('SELECT * FROM vacancies');

    res.json(vacancies.rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getVacancyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vacancy = await pool.query(
      'SELECT * FROM vacancies WHERE vacancy_id = $1',
      [id],
    );

    if (!vacancy.rows[0]) {
      const err = new Error('Not Found');
      err.errorStatus = 404;
      err.message = 'Job vacancy not found';
      throw err;
    }
    res.json(vacancy.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getVacancyByEmployerId = async (req, res, next) => {
  try {
    const { employer_id } = req.body;

    const vacancy = await pool.query(
      'SELECT * FROM vacancies WHERE employer_id = $1',
      [employer_id],
    );

    res.json(vacancy.rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateVacancy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      job_title,
      job_desc,
      job_qualifications,
      job_notes,
      job_level,
      job_educationReq,
      company,
      company_about,
      salary,
      employment_type,
      category,
      job_location,
    } = req.body;

    try {
      if (req.file.filename) {
        var image = req.file.filename;
        const job_thumb = await pool.query(
          `SELECT job_thumb FROM vacancies WHERE vacancy_id = $1`,
          [id],
        );
        const filename = job_thumb.rows[0].job_thumb;
        removeImage(filename);
      } else {
        throw new Error();
      }
    } catch (error) {
      const job_thumb = await pool.query(
        `SELECT job_thumb FROM vacancies WHERE vacancy_id = $1`,
        [id],
      );
      image = job_thumb.rows[0].job_thumb;
    }

    const vacancy = await pool.query(
      `UPDATE vacancies SET job_title = $1, job_desc = $2, job_qualifications = $3,
    job_notes = $4, job_level = $5, "job_educationReq" = $6, company = $7, company_about = $8, salary = $9, employment_type = $10,
    category = $11, job_location = $12, job_thumb = $13 WHERE vacancy_id = $14 RETURNING *`,
      [
        job_title,
        job_desc,
        job_qualifications,
        job_notes,
        job_level,
        job_educationReq,
        company,
        company_about,
        salary,
        employment_type,
        category,
        job_location,
        image,
        id,
      ],
    );

    if (!vacancy.rows.length) {
      const err = new Error('Not Found');
      err.errorStatus = 404;
      err.message = 'update failed! vacancy not found';
      throw err;
    }

    res.json(vacancy.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteVacancy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job_thumb = await pool.query(
      `SELECT job_thumb FROM vacancies WHERE vacancy_id = $1`,
      [id],
    );
    const filename = job_thumb.rows[0].job_thumb;
    removeImage(filename);

    await pool.query(
      'DELETE FROM vacancies WHERE vacancy_id = $1 RETURNING vacancy_id',
      [id],
    );

    res.json({ message: 'Vacancy was successfully deleted' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeImage = (filename) => {
  filePath = path.join(__dirname, '../../../images', filename);
  fs.unlink(filePath, () => console.log('image not found in database'));
};
