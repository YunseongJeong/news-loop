// services/mailer.js
// mail을 보내는 scheduling을 담당하는 service

const cron = require("node-cron");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const db = require(process.cwd() + '/models');

// mail을 보내기 위한 정보를 .env에서 올린다.
dotenv.config();

// mail을 보내는 객체를 생성한다.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// mail의 옵션을 생성한다.
const mailOptions = {
    from: process.env.EMAIL,
    attachments: [
        {
            filename: 'image.png',
            cid: 'articleImage',
        },
    ],
};

// mail의 schduler를 등록하는 함수
module.exports = ()=>{
    // 18시에 mail을 일괄적으로 보낸다.
    cron.schedule('00 18 * * *', async () => { // mail scheduler
        try {
            console.log('send mails')
            // mail을 보낼 user를 가져옴
            const [users] = await db.execute('select email, username from users;');
            // like 수가 가장 많은 article을 가져옴
            // 그러기 위해 nested query와 join을 사용
            const [articles] = await db.execute('select articles.id as id, subject, image_path, content, articles.created_at as created_at, username, ifnull(like_count, 0) as like_count from (articles join users on articles.uid=users.id) left join (select aid, count(1) as like_count from likes group by (aid)) as l on articles.id = l.aid order by like_count desc limit 1;');

            if (articles.length <= 0){
                console.log('article not found');
                return;
            }

            // 보낼 mail의 option에 article 정보 저장
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

            // 실제 메일 전송 users를 순회하며 보냄
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
