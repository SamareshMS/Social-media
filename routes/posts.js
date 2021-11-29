const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller');
const passport = require('passport');

// passport.checkAuthentication this function is used for those routes which needs the user to be signed in for accessing these routes 

router.post('/create', passport.checkAuthentication,  postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

module.exports = router;