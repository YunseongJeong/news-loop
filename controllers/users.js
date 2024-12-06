// controllers/users.js
// user (마이 페이지, 로그인, 회원가입)에 관련된 기능을 가지고 있는 controller

const db = require(process.cwd() + '/models');
const bcrypt = require('bcrypt');
const passport = require('passport');

// render login
// login 페이지를 렌더링한다.
exports.renderLogin = async (req, res, next) =>{
    res.render('login', {title: 'Login Page', isLoggedIn: req.isAuthenticated()});
};

// login
// 로그인 정보를 들고 와서 passport를 사용한 로그인을 진행한다.
exports.login = async (req, res, next) =>{
    passport.authenticate('local', (authErr, user, info)=>{
        if (authErr){
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect(`./login?loginError=${info.message}`);
        }
        return req.login(user, (loginErr)=>{
            if (loginErr){
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    }) (req, res, next);
};

// render signup
// 회원가입 페이지를 렌더링한다.
exports.renderSignup = async (req, res, next)=>{
    res.render('signup', {title: 'Login Page', isLoggedIn: req.isAuthenticated()});
};

// signup
// 입력 받은 user의 정보를 저장한다.
exports.signup = async (req, res, next) =>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try {
        exUser = await db.execute('select 1 from users where email=?;', [email]);
        if (exUser.length <= 0){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await db.execute('insert into users(username, email, password) values (?, ?, ?);', [username, email, hash]);
        return res.redirect('/');
    } catch (err){
        console.error(err);
        return next(err);
    }
};

// logout
// 로그아웃한다.
exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if (err){
            console.error(err);
            next(err);
        }
        return res.redirect('/');
    });
};

// render dashboard
// user의 마이 페이지 (dashboard)를 렌더링한다.
// 본인이 작성한 article들을 관리할 수 있도록 같이 넘긴다.
exports.renderDashboard = async (req, res, next) => {
    try{
        const uid = req.user.id;
        const [articles] = await db.execute('select * from articles where uid=?;', [uid]);

        res.render('dashboard', {user: req.user, articles, isLoggedIn: req.isAuthenticated()});
    } catch (err) {
        console.error(err);
        next(err);
    }

};