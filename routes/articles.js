var express = require('express');
var router = express.Router();
const {isLoggedIn} = require('../midwares');

const {renderArticle, saveComment, deleteComment, deleteArticle} = require('../controllers/articles');

router.delete('/:aid', isLoggedIn, deleteArticle);
router.get('/:aid', renderArticle);
router.post('/comments/:aid', isLoggedIn, saveComment);
router.delete('/comments/:cid', isLoggedIn, deleteComment);
module.exports = router;
