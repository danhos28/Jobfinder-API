require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3
    .upload(uploadParams, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data);
    })
    .promise();
}
exports.uploadFile = uploadFile;

function getFileStream(filekey) {
  const downloadParams = {
    Key: filekey,
    Bucket: bucketName,
  };

  return s3
    .getObject(downloadParams)
    .createReadStream()
    .on('error', (error) => {
      console.log(error);
    });
}
exports.getFileStream = getFileStream;

function deleteFile(filekey) {
  const deleteParams = {
    Key: filekey,
    Bucket: bucketName,
  };

  return s3.deleteObject(deleteParams, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data);
  });
}
exports.deleteFile = deleteFile;
