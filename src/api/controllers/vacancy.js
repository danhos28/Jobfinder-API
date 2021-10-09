const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const pool = require('../../../db');

const { uploadFile, getFileStream, deleteFile } = require('./../../s3');

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
      await uploadFile(req.file);
      removeImage(req.file.filename);
      image = req.file.filename;
    }

    const id = `vacancy-${nanoid(16)}`;
    const createat = new Date(Date.now()).toISOString();

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
        createat,
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
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const offset = (currentPage - 1) * perPage;

    const vacancies = await pool.query(
      'SELECT *, count(*) OVER() AS total_items FROM vacancies ORDER BY job_createat DESC LIMIT $1 OFFSET $2 ',
      [perPage, offset],
    );

    const totalItems = vacancies.rows[0].total_items;

    res.json({ data: vacancies.rows, currentPage, perPage, totalItems });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getImages = (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (error) {
    next(error);
    console.log(error);
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
    next(error);
  }
};

exports.getVacancyByEmployerId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vacancy = await pool.query(
      'SELECT * FROM vacancies WHERE employer_id = $1',
      [id],
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
        await deleteFile(filename);
        await uploadFile(req.file);

        removeImage(filename);
      } else {
        throw new Error();
      }
    } catch (error) {
      const job_thumb = await pool.query(
        `SELECT job_thumb FROM vacancies WHERE vacancy_id = $1`,
        [id],
      );
      await uploadFile(req.file);

      image = job_thumb.rows[0].job_thumb;
      removeImage(req.file.filename);
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
    next(error);
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
    deleteFile(filename);
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

exports.searchVacancy = async (req, res, next) => {
  try {
    const { searchVacancy } = req.query;
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const offset = (currentPage - 1) * perPage;

    const search = await pool.query(
      `SELECT *, count(*) OVER() AS total_items FROM vacancies WHERE job_title ILIKE $1 OR company ILIKE $1 ORDER BY job_title LIMIT $2 OFFSET $3`,
      [`%${searchVacancy}%`, perPage, offset],
    );

    let totalItems = 0;

    if (search.rowCount !== 0) {
      totalItems = search.rows[0].total_items;
    }

    res.json({ data: search.rows, currentPage, perPage, totalItems });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeImage = (filename) => {
  filePath = path.join(__dirname, '../../../storage/images', filename);
  fs.unlink(filePath, () => console.log('image not found in database'));
};
