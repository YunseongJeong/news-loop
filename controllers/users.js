const fs = require('fs');
const db = require(process.cwd() + '/models');
const bcrypt = require('bcrypt');
// const saltRounds = process.env.SALT_ROUNDS;
const passport = require('passport');

exports.renderLogin = async (req, res, next) =>{
    res.render('login', {title: 'Login Page', isLoggedIn: req.isAuthenticated()});
};

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

exports.renderSignup = async (req, res, next)=>{
    res.render('signup', {title: 'Login Page', isLoggedIn: req.isAuthenticated()});
};

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

exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if (err){
            console.error(err);
            next(err);
        }
        return res.redirect('/');
    });
};