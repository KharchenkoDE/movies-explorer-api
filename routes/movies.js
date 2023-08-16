const router = require('express').Router();
const {
  validateObjectId,
  validateMovieInfo,
} = require('../middlewares/validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieInfo, createMovie);
router.delete('/:id', validateObjectId, deleteMovie);

module.exports = router;