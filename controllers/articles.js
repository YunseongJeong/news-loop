const db = require(process.cwd() + '/models');

exports.renderArticle = async (req, res, next) => {
    try{
        const aid = req.params.aid;
        const [rows] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username from articles join users on articles.uid=users.id where articles.id=?', [aid]);
        console.log(rows);
        if (rows.length <= 0){
            return res.status(403).send('내용을 찾을 수 없습니다.');
        }

        res.render('article', {title: rows[0].subject, article: rows[0]});

    } catch (err) {
        console.error(err);
        next(err);
    }



};