const express = require('express');
const app = express()
const port = 5000

const config = require("./config/dev");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`starting on port ${port}!`))