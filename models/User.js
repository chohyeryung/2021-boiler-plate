const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // salt 글자 수 (salt를 이용해 암호화)
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// save전에 비밀번호 암호화
userSchema.pre('save', function( next ){
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호가 변경될 때만 다시 암호화 (name, email 등만 바꿀 때는 비밀번호를 다시 암호화할 필요 없음)
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash;    // post 받아온 password에 hash를 담아줌
                next();    // next -> 바로 save 구문이 실행됨
            })
        })
    } else {
        next();    // next -> 바로 save 구문이 실행됨
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567   암호화된 비밀번호 ~~~~~
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성 (plain object)
    // user._id + 'secretToken' = token
    // 'secretToken' -> user._id
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user);
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }