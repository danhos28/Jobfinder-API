const jwt = require('jsonwebtoken');

// eslint-disable-next-line camelcase
exports.generateAccessToken = (user_id, first_name) => {
  const payload = {
    user_id,
    name: first_name,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE, 10),
  });
};

// eslint-disable-next-line camelcase
exports.generateRefreshToken = (user_id, first_name) => {
  const payload = {
    user_id,
    name: first_name,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d',
  });
};
