const { PORT = 3000 } = process.env;
const { DATA_BASE_URI } = process.env;
const { NODE_ENV = 'develop' } = process.env;
const { JWT_SECRET } = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  DATA_BASE_URI,
};
