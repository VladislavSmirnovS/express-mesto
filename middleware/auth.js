const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'nobodyknowaboutme');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
module.exports = auth;
