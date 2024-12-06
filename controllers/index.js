// controllers/auth.js
// 메인 페이지와 관련 된 기능을 가진 controller

const db = require(process.cwd() + '/models');

// index.html 즉 메인 페이지를 렌더링 한다.
exports.renderIndex = async (req, res, next)=>{
    try{
        const [articles] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username, ifnull(like_count, 0) as like_count from (articles join users on articles.uid=users.id) left join (select aid, count(1) as like_count from likes group by (aid)) as l on articles.id = l.aid order by created_at desc;');
        res.render('index', {articles, title: 'NEWS LOOP', isLoggedIn: req.isAuthenticated()});
    } catch (err){
        console.error(err);
        next(err);
    }
}