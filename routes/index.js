// routes/index.js
// index routing을 담당하는 router

const express = require('express');
const router = express.Router();

const {renderIndex} = require('../controllers/index');

// main page
router.get('/', renderIndex);

module.exports = router;
