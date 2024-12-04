const fs = require('fs');
const db = require(process.cwd() + '/models');

exports.renderIndex = async (req, res, next)=>{
    try{
        const [articles] = await db.execute('select subject, description, image_path from articles');
        res.render('index', {articles, title: 'NEWS LOOP'});
    } catch (err){
        console.error(err);
        next(err);
    }
}