const dotenv = require('dotenv');
dotenv.config();

const express=require('express');
const app=express();

const bodyParser=require('body-parser');//parse incoming request bodies in a middleware before your handlers, and it's particularly useful for extracting data from HTTP POST requests.
app.use(bodyParser.json());//parses incoming JSON payloads of requests and makes the parsed data available on the req.body 

app.use(bodyParser.urlencoded({ extended:true}));//middleware is used to parse incoming request bodies containing URL-encoded data (typically from HTML forms).

app.set("view engine","ejs");

app.use(express.json());//similar to bodyParser.json(). 

const path=require('path');
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    rolling: true
}));

const nodemailer=require('nodemailer');
const multer=require("multer");
const jwt = require('jsonwebtoken');

const homeRouter = require('./Routes/home');
app.use('/',homeRouter);

const loginRouter = require('./Routes/login');
app.use('/login',loginRouter);

const registerRouter = require('./Routes/register');
app.use('/register',registerRouter);

const logoutRouter = require('./Routes/logout');
app.use('/logout',logoutRouter);

const giveAdvertismentRouter = require('./Routes/giveAdvertisement');
app.use('/seller/giveAdvertisement',giveAdvertismentRouter);

const advertisementVerifyRouter = require('./Routes/advertisementVerify');
app.use('/admin/advertisementVerify',advertisementVerifyRouter);

const myAdvertisementsRouter = require('./Routes/myAdvertisements');
app.use('/seller/myAdvertisements',myAdvertisementsRouter);

const singleAdvertisementRouter = require('./Routes/singleAdvertisement');
app.use('/singleAdvertisement',singleAdvertisementRouter);

app.listen(3000,(req, res) => {
    console.log('running port........');
});
