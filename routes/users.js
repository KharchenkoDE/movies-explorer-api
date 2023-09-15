const router = require('express').Router();
const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');
const {
  validateProfileInfo,
} = require('../middlewares/validators');

router.get('/me', getCurrentUser);
router.patch('/me', validateProfileInfo, updateUserInfo);

module.exports = router;