const db = require(process.cwd() + '/models');

exports.renderArticle = async (req, res, next) => {
    try{
        const aid = req.params.aid;
        const [rows] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username from articles join users on articles.uid=users.id where articles.id=?', [aid]);

        if (rows.length <= 0){
            return res.status(403).send('내용을 찾을 수 없습니다.');
        }
        const [comments] = await db.execute('select comments.id as id, uid, username, content from comments join users on comments.uid=users.id where aid=?;', [rows[0].id]);

        res.render('article', {title: rows[0].subject, article: rows[0], comments: comments, user: req.user});

    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.saveComment = async (req, res, next) => {
    try{
        const aid = req.params.aid;
        const uid = req.user.id;
        const content = req.body.content;
        await db.execute('insert into comments (aid, uid, content) values (?, ?, ?);', [aid, uid, content]);
        return res.redirect('.?message=성공적으로 댓글을 달았습니다.');
    } catch (err){
        console.error(err);
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const [comments] = await db.execute('select uid from comments where id=?', [cid]);
        if (comments.length <= 0){
            return res.status(403).send('해당 댓글을 찾을 수 없습니다.');
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
}