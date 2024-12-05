var express = require('express');
var router = express.Router();

const {renderArticle} = require('../controllers/articles');

router.get('/:aid', renderArticle);

module.exports = router;
