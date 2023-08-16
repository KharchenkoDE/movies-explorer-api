const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  NODE_ENV,
  JWT_SECRET,
} = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
