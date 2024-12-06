var express = require('express');
var router = express.Router();
const {renderLogin, login, renderSignup, signup, logout, renderDashboard} = require('../controllers/users');
const {isNotLoggedIn, isLoggedIn} = require('../midwares');

router.get('/dashboard', isLoggedIn, renderDashboard);

router.get('/logout', isLoggedIn, logout);

// login page
router.get('/login', isNotLoggedIn, renderLogin);
router.post('/login', login);

// sign up page
router.get('/signup', renderSignup);
router.post('/signup', signup);

module.exports = router;
