const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT 
const BodyParser = require('body-parser')
const margan = require('morgan')
const router = require('./Router/router')
const mongoose = require('mongoose')
const cors = require('cors');
// use cors 
app.use(cors()); 
app.use(express.json());

//use body-parser:
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }));
//use margan:
app.use(margan('dev'))
//use URL from Router
app.use('/api/auth', router)

mongoose.connect('mongodb://127.0.0.1:27017/Share-pictures');
app.listen(port , () => console.log(`the server run in ${port}`))