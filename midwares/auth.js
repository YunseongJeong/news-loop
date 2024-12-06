// midwares/auth.js
// 로그인 여부를 확인 하는 midware

// is logged in
// login 된 상태인지 확인한다.
exports.isLoggedIn = (req, res, next) =>{
    if (req.isAuthenticated()){
        next();
    } else {
        res.status(403).render('error', { error: {status: 403}, message: '로그인 필요'});
    }
};

// is not logged in
// login 안 된 상태인지 확인한다.
exports.isNotLoggedIn = (req, res, next) =>{
    if (!req.isAuthenticated()){
        next();
    } else {
        const message = encodeURIComponent('로그인 한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
}