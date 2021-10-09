const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const pool = require('../../../db');

const { uploadFile, getFileStream, deleteFile } = require('../../s3');

exports.postCv = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = req.file.filename;
    uploadFile(req.file);

    const prevResume = await pool.query(
      'SELECT resume FROM resumes WHERE jobseeker_id = $1',
      [id],
    );
    if (prevResume) {
      deleteFile(prevResume.rows[0].resume);
    }

    await pool.query('UPDATE resumes SET resume = $1 WHERE jobseeker_id = $2', [
      resume,
      id,
    ]);

    removeFile(resume);

    res.status(200).json({ message: 'upload resume success' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.donwloadCv = async (req, res, next) => {
  try {
    const { id } = req.params;

    const filename = await pool.query(
      'SELECT resume FROM resumes WHERE jobseeker_id = $1',
      [id],
    );

    res.attachment(filename.rows[0].resume);
    const readStream = getFileStream(filename.rows[0].resume);
    readStream.pipe(res);

    // const filepath = path.join(
    //   __dirname,
    //   '../../../storage/resumes',
    //   filename.rows[0].resume,
    // );

    // res.download(readStream, (err) => {
    //   if (err) {
    //     res.status(500).send({
    //       message: 'File can not be downloaded: ' + err,
    //     });
    //   }
    // });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.removeCv = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = '';
    const prevResume = await pool.query(
      'SELECT resume FROM resumes WHERE jobseeker_id = $1',
      [id],
    );

    if (prevResume) {
      deleteFile(prevResume.rows[0].resume);
    }

    await pool.query('UPDATE resumes SET resume = $1 WHERE jobseeker_id = $2', [
      resume,
      id,
    ]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeFile = (filename) => {
  filePath = path.join(__dirname, '../../../storage/resumes', filename);
  fs.unlink(filePath, () => console.log('file not found in database'));
};
