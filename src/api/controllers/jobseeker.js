const fs = require('fs');
const path = require('path');
const pool = require('../../../db');

const { uploadFile, getFileStream, deleteFile } = require('../../s3');

exports.getJobseekerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await pool.query(
      `SELECT jobseekers.*, resumes.resume FROM jobseekers INNER JOIN resumes
      ON jobseekers.jobseeker_id = resumes.jobseeker_id WHERE jobseekers.jobseeker_id = $1`,
      [id],
    );

    if (!profile.rowCount) {
      const err = new Error('Not Found');
      err.errorStatus = 404;
      err.message = 'User not found';
      throw err;
    }

    res.status(200).json(profile.rows[0]);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.editJobseeker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      phone_number,
      tagline,
      experiences,
      skills,
      certificates,
      education,
      address,
      summary,
    } = req.body;

    const editProfile = await pool.query(
      `UPDATE jobseekers SET first_name = $1, last_name = $2, phone_number = $3, tagline = $4, experiences = $5,
      skills = $6, certificates = $7, education = $8, address = $9, summary = $10 WHERE jobseeker_id = $11 RETURNING *`,
      [
        first_name,
        last_name,
        phone_number,
        tagline,
        experiences,
        skills,
        certificates,
        education,
        address,
        summary,
        id,
      ],
    );

    if (!editProfile.rowCount) {
      const err = new Error('Not Found');
      err.errorStatus = 404;
      err.message = 'update failed! jobseeker not found';
      throw err;
    }
    res.json({ message: 'Update profile success' }).status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.postPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file.filename;

    await uploadFile(req.file);

    const prevPicture = await pool.query(
      'SELECT profile_picture FROM jobseekers WHERE jobseeker_id = $1',
      [id],
    );
    const prevPictureFile = prevPicture.rows[0].profile_picture;
    if (prevPictureFile) {
      deleteFile(prevPictureFile);
    }

    await pool.query(
      'UPDATE jobseekers SET profile_picture = $1 WHERE jobseeker_id = $2',
      [image, id],
    );

    removeImage(image);
    res.status(200).json({ message: 'upload picture success' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Sernver Error');
  }
};

exports.removeProfilepic = async (req, res) => {
  try {
    const { id } = req.params;

    const prevPicture = await pool.query(
      'SELECT profile_picture FROM jobseekers WHERE jobseeker_id = $1',
      [id],
    );
    const prevPictureFile = prevPicture.rows[0].profile_picture;
    if (prevPictureFile) {
      removeImage(prevPictureFile);

      deleteFile(prevPictureFile);
    }

    await pool.query(
      'UPDATE jobseekers SET profile_picture = null WHERE jobseeker_id = $1',
      [id],
    );

    res.status(200).json({ message: 'profile picture removed' });
  } catch (error) {
    console.log(error);
  }
};

exports.getProfilePic = (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeImage = (filename) => {
  filePath = path.join(__dirname, '../../../storage/images', filename);
  fs.unlink(filePath, () => console.log('image not found in database'));
};
