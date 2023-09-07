const dotenv = require('dotenv');
dotenv.config();

const express=require('express');
const app=express();

const cors = require('cors')
// Middleware for handling CORS
app.use(cors({
    origin:['http://127.0.0.1:5173',`${process.env.DOMAIN}`],
    credentials: true,
    headers:['X-Requested-With','content-type','Authorization'],
    methods:['GET','POST'],
}));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser=require('body-parser');//parse incoming request bodies in a middleware before your handlers, and it's particularly useful for extracting data from HTTP POST requests.
app.use(bodyParser.json());//parses incoming JSON payloads of requests and makes the parsed data available on the req.body 

app.use(bodyParser.urlencoded({ extended:true}));//middleware is used to parse incoming request bodies containing URL-encoded data (typically from HTML forms).

app.use(express.json());//similar to bodyParser.json(). 

const path=require('path');
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

const nodemailer=require('nodemailer');
const multer=require("multer");
const jwt = require('jsonwebtoken');

const homeRouter = require('./Routes/home');
app.use('/api/',homeRouter);

const loginRouter = require('./Routes/login');
app.use('/api/login',loginRouter);

const registerRouter = require('./Routes/register');
app.use('/api/register',registerRouter);

const logoutRouter = require('./Routes/logout');
app.use('/api/logout',logoutRouter);

const giveAdvertismentRouter = require('./Routes/giveAdvertisement');
app.use('/api/seller/giveAdvertisement',giveAdvertismentRouter);

const advertisementVerifyRouter = require('./Routes/advertisementVerify');
app.use('/api/admin/advertisementVerify',advertisementVerifyRouter);

const myAdvertisementsRouter = require('./Routes/myAdvertisements');
app.use('/api/seller/myAdvertisements',myAdvertisementsRouter);

const singleAdvertisementRouter = require('./Routes/singleAdvertisement');
app.use('/api/singleAdvertisement',singleAdvertisementRouter);

const coordinatesRouter = require('./Routes/coordinates');
app.use('/api/coordinates',coordinatesRouter);

const authenticateRouter = require('./Routes/authenticate');
app.use('/api/authenticate',authenticateRouter);

app.listen(5000,(req, res) => {
    console.log('running port........');
});
