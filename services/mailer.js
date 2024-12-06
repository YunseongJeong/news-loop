const cron = require("node-cron");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const db = require(process.cwd() + '/models');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const mailOptions = {
    from: process.env.EMAIL,
    attachments: [
        {
            filename: 'image.png',
            cid: 'articleImage',
        },
    ],
};

module.exports = ()=>{
    cron.schedule('05 18 * * *', async () => { // mail scheduler
        try {
            console.log('send mails')
            const [users] = await db.execute('select email, username from users;');
            const [articles] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username, ifnull(like_count, 0) as like_count from (articles join users on articles.uid=users.id) left join (select aid, count(1) as like_count from likes group by (aid)) as l on articles.id = l.aid order by like_count desc limit 1;');

            if (articles.length <= 0){
                console.log('article not found');
                return;
            }
            mailOptions.subject = articles[0].subject;
            mailOptions.html =
                `<h1> ${articles[0].subject} </h1> 
                <br>  
                <img src="cid:articleImage" style="border-radius: 10px; width: 200px; height: 200px; margin: 15px;"/> 
                <br> 
                <a>${articles[0].content}</a> 
                <br> 
                <a> writed by ${articles[0].username} 
                </a>`;
            mailOptions.attachments[0].path = process.cwd() + '/public' + articles[0].image_path;
            for (const user of users){
                mailOptions.to = user.email;

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('메일 전송 실패:', error);
                    } else {
                        console.log('메일 전송 성공:', info.response);
                    }
                });
            }


        } catch (err) {
            console.error('오류 발생:', err);
        }
    });
}
