var express = require('express');
var router = express.Router();
const {isLoggedIn} = require('../midwares');

const {renderArticle, saveComment, deleteComment, deleteArticle, like, unlike} = require('../controllers/articles');

router.delete('/:aid', isLoggedIn, deleteArticle);
router.get('/:aid', renderArticle);
router.post('/comments/:aid', isLoggedIn, saveComment);
router.delete('/comments/:cid', isLoggedIn, deleteComment);

router.get('/like/:aid', isLoggedIn, like);
router.get('/unlike/:aid', isLoggedIn, unlike);

module.exports = router;
