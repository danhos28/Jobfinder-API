const jwt = require('jsonwebtoken');

// eslint-disable-next-line camelcase
exports.generateAccessToken = (jobseeker_id) => {
  const payload = {
    jobseeker: jobseeker_id,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE, 10),
  });
};

// eslint-disable-next-line camelcase
exports.generateRefreshToken = (jobseeker_id) => {
  const payload = {
    jobseeker: jobseeker_id,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d',
  });
};
