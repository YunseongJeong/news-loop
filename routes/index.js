var express = require('express');
var router = express.Router();

const {renderIndex} = require('../controllers/index');

/* GET home page. */
router.get('/', renderIndex);

module.exports = router;
