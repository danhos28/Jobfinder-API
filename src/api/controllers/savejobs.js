const { nanoid } = require('nanoid');
const pool = require('../../../db');

exports.addSaveJob = async (req, res, next) => {
  try {
    const { jobseeker_id, vacancy_id } = req.body;
    const save_id = `save-${nanoid(16)}`;

    const isExisted = await pool.query(
      'SELECT * FROM savejobs WHERE jobseeker_id = $1 AND vacancy_id = $2',
      [jobseeker_id, vacancy_id],
    );

    if (isExisted.rowCount === 0) {
      await pool.query('INSERT INTO savejobs VALUES($1, $2, $3)', [
        save_id,
        jobseeker_id,
        vacancy_id,
      ]);
    }

    res.status(200).send('job saved!');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getSaveJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const savejob = await pool.query(
      `SELECT vacancies.* FROM savejobs INNER JOIN vacancies ON
    savejobs.vacancy_id = vacancies.vacancy_id WHERE savejobs.jobseeker_id = $1`,
      [id],
    );

    if (!savejob.rows[0]) {
      const err = new Error('Not Found');
      err.errorStatus = 404;
      err.message = 'No saved job found';
      throw err;
    }

    res.status(200).json(savejob.rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteSaveJob = async (req, res, next) => {
  try {
    const { jobseeker_id, vacancy_id } = req.body;

    await pool.query(
      'DELETE FROM savejobs WHERE jobseeker_id = $1 AND vacancy_id = $2',
      [jobseeker_id, vacancy_id],
    );

    res.status(200).send(`saved job removed`);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
