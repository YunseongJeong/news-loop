// passport.js
// passport 설정을 담당한다.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require(process.cwd() + '/models');
const bcrypt = require('bcrypt');

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
    }, async (email, password, done) =>{
        try{
            const [rows] = await db.execute('select * from users where email = ?', [email]);
            if (rows.length > 0) {
                const result = await bcrypt.compare(password, rows[0].password);
                if (result) {
                    done(null, rows[0]);
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) =>{
        try {
            const [rows] = await db.execute('select id, created_at, email, username from users where id=?', [id]);
            if (rows.length > 0){
                const user = rows[0];
                done(null, user);
            } else done(null);
        } catch (err) {
            console.error(err);
            done(err);
        }
    });
}

