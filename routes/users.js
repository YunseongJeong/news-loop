// routes/users.js
// user와 관련된 routing을 정의하는 router

const express = require('express');
const router = express.Router();
const {renderLogin, login, renderSignup, signup, logout, renderDashboard} = require('../controllers/users');
const {isNotLoggedIn, isLoggedIn} = require('../midwares/auth');

// dashboard
router.get('/dashboard', isLoggedIn, renderDashboard);

// logout
router.get('/logout', isLoggedIn, logout);

// login page
router.get('/login', isNotLoggedIn, renderLogin);
router.post('/login', login);

// sign up page
router.get('/signup', renderSignup);
router.post('/signup', signup);

module.exports = router;
