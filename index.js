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

const homeRouter = require('./Routes/home');
app.use('/home',homeRouter);

// app.get('/',(req,res)=>{
//     console.log('running........');
//     res.render('index') 
// })

app.listen(3000,(req, res) => {
    console.log('running port........');
});
