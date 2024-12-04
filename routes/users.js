var express = require('express');
var router = express.Router();
const {renderLogin} = require('../controllers/users');

/* GET users listing. */
router.get('/login', renderLogin);

module.exports = router;
