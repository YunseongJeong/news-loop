// controllers/articles.js
// article 관련 기능을 가지고 있는 controller

const db = require(process.cwd() + '/models/database');

// delete article
// article을 삭제한다.
// (본인이 쓴 article인지 확인 후 삭제한다.
exports.deleteArticle = async (req, res, next) => {
    try {
        const aid = req.params.aid;
        console.log(`try delete article ${aid}`);
        const [articles] = await db.execute('select * from articles where id=?', [aid]);
        if (articles[0].length <= 0){
            return res.status(503).render('error', {message: '해당 글을 찾을 수 없습니다.', error:{status: 503}});
        }
        if (articles[0].uid !== req.user.id){
            return res.status(403).render('error', {message: '본인 글만 삭제 할 수 있습니다.', error:{status: 403}});
        }
        await db.execute('delete from articles where id=?', [aid]);
        return res.redirect('/users/dashboard?message=성공적으로 삭제했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// render article
// article page를 렌더링 한다.
// article 정보, 작성한 user의 이름, 댓글, 좋아요 수를 db에서 가져온 후 rendering에 사용한다.
exports.renderArticle = async (req, res, next) => {
    try{
        const aid = req.params.aid;
        const [rows] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username from articles join users on articles.uid=users.id where articles.id=?', [aid]);

        if (rows.length <= 0){
            return res.status(503).render('error', {message: '내용을 찾을 수 없습니다.', error:{status: 503}});
        }
        const uid = req.user?.id || null;

        let like = false;
        if (uid !== null){
            const [rows] = await db.execute('select count(1) > 0 as "like" from likes where uid=?', [uid]);

            like = rows[0].like;
        }

        const [likeCount] = await db.execute('select count(1) as c from likes where aid=?;', [aid]);
        const [comments] = await db.execute('select comments.id as id, uid, username, content from comments join users on comments.uid=users.id where aid=?;', [rows[0].id]);
        return res.render('article', {title: rows[0].subject, article: rows[0], comments: comments, user: req.user, isLoggedIn: req.isAuthenticated(), likeCount: likeCount[0].c, like: like});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// like
// 좋아요 수를 올린다.
exports.like = async (req, res, next) =>{
    try{
        const aid = req.params.aid;
        const uid = req.user.id;
        await db.execute('insert into likes (aid, uid) values (?, ?)', [aid, uid]);
        res.redirect(`/articles/${aid}`);
    } catch (err){
        console.error(err);
        next(err);
    }
}

// unlike
// 좋아요를 취소한다.
exports.unlike = async (req, res, next) =>{
    try{
        const aid = req.params.aid;
        const uid = req.user.id;
        await db.execute('delete from likes where uid=? and aid=?;', [uid, aid]);
        res.redirect(`/articles/${aid}`);
    } catch (err){
        console.error(err);
        next(err);
    }
}

// save comment
// 작성한 댓글을 저장한다.
exports.saveComment = async (req, res, next) => {
    try{
        const aid = req.params.aid;
        const uid = req.user.id;
        const content = req.body.content;
        await db.execute('insert into comments (aid, uid, content) values (?, ?, ?);', [aid, uid, content]);
        return res.redirect(`/articles/${aid}?message=성공적으로 댓글을 달았습니다.`);
    } catch (err){
        console.error(err);
        next(err);
    }
};

// delete comment
// 본인이 작성한 댓글인지 확인 후 삭제한다.
exports.deleteComment = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const [comments] = await db.execute('select uid from comments where id=?', [cid]);
        if (comments.length <= 0){
            return res.status(503).send('해당 댓글을 찾을 수 없습니다.');
        }
        if (req.user.id === comments[0].uid){
            await db.execute('delete from comments where id=?', [cid]);
            return res.redirect('.?message=성공적으로 삭제했습니다.');
        } else {
            return res.status(403).send('본인 댓글만 삭제할 수 있습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// render edit article
// article 작성 페이지를 렌더링한다.
exports.renderEditArticle = (req, res, next)=>{
    return res.render('edit-article', { title: "create article", isLoggedIn: req.isAuthenticated()});
};

// save article
// 작성된 article을 저장한다.
exports.saveArticle = async (req, res, next) => {
    try {
        const uid = req.user.id;
        await db.execute('insert into articles(subject, description, content, uid, image_path) values (?, ?, ?, ?, ?)'
            , [req.body.subject, req.body.description, req.body.content, uid, `/images/${req.file.filename}`]);
        return res.redirect('/?message=성공적으로 article을 작성했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
};