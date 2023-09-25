const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  NODE_ENV,
  JWT_SECRET,
} = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    next(new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
