const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT 
const BodyParser = require('body-parser')
const margan = require('morgan')
const router = require('./Router/router')
const mongoose = require('mongoose')
const cors = require('cors');
const path = require('path');


// use cors 
app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true
  }));
app.use(express.json());

//use body-parser:
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }));
//use margan:
app.use(margan('dev'))
//use URL from Router
app.use('/api/auth', router)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect('mongodb+srv://adnwebdeveloper24:ONLYyou01@sharepictures.d39m9co.mongodb.net/?retryWrites=true&w=majority&appName=SharePictures');
app.listen(port , () => console.log(`the server run in ${port}`))
