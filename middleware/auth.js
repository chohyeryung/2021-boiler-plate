const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리를 하는곳
    
    // 1. client cookie에서 token 가져오기
    let token = req.cookies.x_auth;
    // 2. token 복호화 한 후 user 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        // 3. user가 있으면 인증 ok
        req.token = token;
        req.user = user;
        next();
    })
   
    // 3. user가 없으면 인증 no
}

module.exports = { auth };