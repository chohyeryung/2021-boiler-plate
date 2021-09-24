const express = require('express');
const app = express();
const port = 5000;

const { User } = require('./models/User');

const config = require("./config/key");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다. (status(200) : success)
    const user = new User(req.body);
    
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    });
})

app.listen(port, () => console.log(`starting on port ${port}!`))