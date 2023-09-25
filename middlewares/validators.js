const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const URIAdressRegEx = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i;

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Некорректный id');
    }),
  }),
});

const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URIAdressRegEx),
    trailerLink: Joi.string().required().pattern(URIAdressRegEx),
    thumbnail: Joi.string().required().pattern(URIAdressRegEx),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Имя не должно быть короче 2 символов',
        'string.max': 'Имя не должно быть длиннее 30 символов',
      }),
    password: Joi.string().required(),
    email: Joi.string().required().email().messages({ 'string.email': 'Невалидный Email' }),
  }),
});

const validateAuthInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({ 'string.email': 'Невалидный Email' }),
    password: Joi.string().required(),
  }),
});

const validateProfileInfo = celebrate({
  body: {
    email: Joi.string().required().email().messages({ 'string.email': 'Невалидный Email' }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Имя не должно быть короче 2 символов',
        'string.max': 'Имя не должно быть длиннее 30 символов',
      }),
  },
});

module.exports = {
  URIAdressRegEx,
  validateObjectId,
  validateMovieInfo,
  validateUserInfo,
  validateAuthInfo,
  validateProfileInfo,
};
