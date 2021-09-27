const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const pool = require('../../../db');

exports.postCv = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume_id = `resume-${nanoid(16)}`;
    const resume = req.file.filename;

    await pool.query(
      'INSERT INTO resumes (resume_id, jobseeker_id, resume) VALUES($1, $2, $3) RETURNING *',
      [resume_id, id, resume],
    );

    res.status(200).json({ message: 'upload resume success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.donwloadCv = async (req, res, next) => {
  const { id } = req.params;

  const filename = await pool.query(
    'SELECT resume FROM resumes WHERE jobseeker_id = $1',
    [id],
  );

  const filepath = path.join(
    __dirname,
    '../../../storage/resumes',
    filename.rows[0].resume,
  );

  res.download(filepath, (err) => {
    if (err) {
      res.status(500).send({
        message: 'File can not be downloaded: ' + err,
      });
    }
  });
};
