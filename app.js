require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const UnknowError = require('./middlewares/unknow-error');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, DATA_BASE_URI, PORT } = require('./config');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});


const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE_URI : 'mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(helmet());

app.use(limiter);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(requestLogger);

app.use(cors({ origin: true, credentials: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(UnknowError);

app.listen(PORT, () => console.log('Сервер запущен'));
