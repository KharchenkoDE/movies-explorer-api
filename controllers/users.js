const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const {
  NODE_ENV,
  JWT_SECRET,
} = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production'
            ? JWT_SECRET
            : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};

const getUserInfo = (id, res, next) => {
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  getUserInfo(req.user._id, res, next);
};

const createUser = (req, res, next) => {
  const newUser = req.body;
  bcrypt.hash(newUser.password, 10)
    .then((hash) => User.create({
      name: newUser.name,
      email: newUser.email,
      password: hash,
    }))
    .then((user) => {
      const {
        email, name,
      } = user;

      res.status(201).send({
        email, name,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с этим email уже существует'));
      } else {
        next(error);
      }
    });
};

const updateUserData = (res, req, next, updatedData) => {
  const { user: { _id } } = req;
  User.findByIdAndUpdate(_id, updatedData, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

const updateUserInfo = (req, res, next) => updateUserData(
  res,
  req,
  next,
  {
    name: req.body.name,
    email: req.body.email,
  },
);

module.exports = {
  login,
  getCurrentUser,
  createUser,
  updateUserInfo,
};
