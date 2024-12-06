// routes/articles.js
// article에 관련된 routing을 정의하는 router

const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../midwares/auth');

const {renderArticle, saveComment, deleteComment, deleteArticle, like, unlike, saveArticle, renderEditArticle} = require('../controllers/articles');

// article에 이미지를 올리기 위해서 multer를 사용한다.
const multer = require('../services/multer');
const upload = multer(); // for image

// edit article page
router.get('/edit', isLoggedIn, renderEditArticle);
router.post('/edit', isLoggedIn, upload.single('image_path'), saveArticle);

// article
router.delete('/:aid', isLoggedIn, deleteArticle);
router.get('/:aid', renderArticle);

// article's comment
router.post('/comments/:aid', isLoggedIn, saveComment);
router.delete('/comments/:cid', isLoggedIn, deleteComment);

// article's like
router.get('/like/:aid', isLoggedIn, like);
router.get('/unlike/:aid', isLoggedIn, unlike);

module.exports = router;
