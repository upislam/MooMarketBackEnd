const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "ffeeb2c5",
  apiSecret: "U1PLibsE0bNCGMdM"
})

const { pool } = require("../db");
const { authenticate } = require("../authenticate");

const otpMap = new Map();
// async function f(){
//     const otp_pin_token = await jwt.sign({ otp_pin: "12" }, process.env.JWT_SECRET, { expiresIn: '300s' });
//     otpMap.set("13",otp_pin_token);
//     console.log(otpMap.get("01711431964"))
// }

// f()

router.get('/districts', async(req, res) => {

    const client = await pool.connect();
    const r = await client.query('SELECT name FROM District');
    client.release(true);
    res.send(r.rows);
})

router.get('/phoneNumbers', async(req, res) => {
    const client = await pool.connect();
    const r = await client.query('SELECT phone_number FROM Users');
    client.release(true);
    res.send(r.rows);
})

router.post('/thanas', async(req, res) => {
    var {district} = req.body;
    const client = await pool.connect();
    const r = await client.query('SELECT Thana.name FROM District JOIN Thana on District.district_id=Thana.district_id where District.name= $1', [district]);
    client.release(true)
    res.send(r.rows);
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

router.post('/buyersubmit', async(req, res) => {

    const auth = await authenticate(req.cookies.accessToken);
    if(auth){
        res.status(500).json({success: false,error: false,message: "Already logged in",data: null});
        return
    }

    var {name, email, password, phone_number, birth_date, thana, delivery_address,nid,otp} = req.body;

    try{
        const {otp_pin} = jwt.verify(otpMap.get(phone_number),process.env.JWT_SECRET)
        if(otp_pin != otp){
            res.status(500).json({success: false,error: false,message: "OTP mismatch",data: null});
            return;
        }
    }
    catch(e){
        console.error(e)
        res.status(500).json({success: false,error: true,message: "OTP has timed out",data: null});
        return
    }

    const salt = await bcrypt.genSalt(parseInt((process.env.SALT)));
    password = await bcrypt.hash(password, salt);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,      
        secure: true, 
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls:{
          rejectUnauthorized:false
      }
    });

    const emailToken = await jwt.sign({phone_number:phone_number,},process.env.JWT_SECRET,{expiresIn:'1h',})

    const url =`${process.env.DOMAIN}/verify/${emailToken}`;
    transporter.sendMail({
        to: email,
        subject:'Confirm Email',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm email</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
            <style>
                .button-24 {
                    background: #FF4742;
                    border: 1px solid #FF4742;
                    border-radius: 6px;
                    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
                    box-sizing: border-box;
                    color: #FFFFFF;
                    cursor: pointer;
                    display: inline-block;
                    font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
                    font-size: 16px;
                    font-weight: 800;
                    line-height: 16px;
                    min-height: 40px;
                    outline: 0;
                    padding: 12px 14px;
                    text-align: center;
                    text-rendering: geometricprecision;
                    text-transform: none;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    vertical-align: middle;
                    }
                    
                    .button-24:hover,
                    .button-24:active {
                    background-color: initial;
                    background-position: 0 0;
                    color: #FF4742;
                    }
                    
                    .button-24:active {
                    opacity: .5;
                    }
                </style>    
            </head>
            <body>
            <div class="row">
            <img src="http://drive.google.com/uc?export=view&id=16RT4EO9qkT0osWvcK3k3ZQJLLBO5UbAW" class="img-thumbnail mx-auto my-auto" style="width:800px;height:600px;align-items:center">
            </div>
            <div class="row">
                <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to verify email</button></a>
                <p style="margin: auto;padding: 10px; font-size: 20px;">Please click this to verify your email: <a href="${url}">${url}</a></p>
            </div>
            <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"
            ></script>
        </body>
        </html>`,
    }).catch(err =>{
        console.log(err)
        res.status(500).json({success: false,error: true,message: "Email was wrong",data: null});
        return
    });

    const client = await pool.connect();
    var user_id;
    user_id = await client.query('INSERT INTO Users(name,email,phone_number,password,birth_date,updated_at,thana_id,type) VALUES ($1,$2,$3,$4,$5,NULL,get_thana_id($6),\'buyer\') returning user_id', [name, email, phone_number, password, birth_date, thana]);
    if(nid)
        await client.query('INSERT INTO Buyer(delivery_address,nid,user_id) VALUES ($1,$2,$3)', [delivery_address, nid, user_id.rows[0].user_id]);
    else
        await client.query('INSERT INTO Buyer(delivery_address,user_id) VALUES ($1,$2)', [delivery_address,user_id.rows[0].user_id]);
    client.release(true)
    res.status(200).json({success: true,error: false,message: "Buyer Registration successful",data: null});
})

router.post('/sellersubmit', async(req, res) => {

    const auth = await authenticate(req.cookies.accessToken);
    if(auth){
        res.status(500).json({success: false,error: false,message: "Already logged in",data: null});
        return
    }

    var {name, email, password, phone_number, birth_date, thana,nid,trade_license_no,company_name,present_address,permanent_address,short_description,otp} = req.body;
    
    try{
        const {otp_pin} = jwt.verify(otpMap.get(phone_number),process.env.JWT_SECRET)
        if(otp_pin != otp){
            res.status(500).json({success: false,error: false,message: "OTP mismatch",data: null});
            return;
        }
    }
    catch(e){
        res.status(500).json({success: false,error: true,message: "OTP has timed out",data: null});
        return
    }
    
    const salt = await bcrypt.genSalt(parseInt((process.env.SALT)));
    password = await bcrypt.hash(password, salt);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,      
        secure: true, 
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls:{
          rejectUnauthorized:false
      }
    });

    const emailToken = await jwt.sign({phone_number:phone_number,},process.env.JWT_SECRET,{expiresIn:'1h',})

    const url =`${process.env.DOMAIN}/verify/${emailToken}`;
    transporter.sendMail({
        to: email,
        subject:'Confirm Email',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm email</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
            <style>
                .button-24 {
                    background: #FF4742;
                    border: 1px solid #FF4742;
                    border-radius: 6px;
                    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
                    box-sizing: border-box;
                    color: #FFFFFF;
                    cursor: pointer;
                    display: inline-block;
                    font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
                    font-size: 16px;
                    font-weight: 800;
                    line-height: 16px;
                    min-height: 40px;
                    outline: 0;
                    padding: 12px 14px;
                    text-align: center;
                    text-rendering: geometricprecision;
                    text-transform: none;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    vertical-align: middle;
                    }
                    
                    .button-24:hover,
                    .button-24:active {
                    background-color: initial;
                    background-position: 0 0;
                    color: #FF4742;
                    }
                    
                    .button-24:active {
                    opacity: .5;
                    }
                </style>    
            </head>
            <body>
            <div class="row">
            <img src="http://drive.google.com/uc?export=view&id=16RT4EO9qkT0osWvcK3k3ZQJLLBO5UbAW" class="img-thumbnail mx-auto my-auto" style="width:800px;height:600px;align-items:center">
            </div>
            <div class="row">
                <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to verify email</button></a>
                <p style="margin: auto;padding: 10px; font-size: 20px;">Please click this to verify your email: <a href="${url}">${url}</a></p>
            </div>
            <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"
            ></script>
        </body>
        </html>`,
    }).catch(err =>{
        console.log(err)
        res.status(500).json({success: false,error: true,message: "Email was wrong",data: null});
        return
    }); 

    const client = await pool.connect();
    var user_id
    user_id = await client.query('INSERT INTO Users(name,email,phone_number,password,birth_date,updated_at,thana_id,type) VALUES ($1,$2,$3,$4,$5,NULL,get_thana_id($6),\'seller\') returning user_id', [name, email, phone_number, password, birth_date, thana]);
    await client.query('INSERT INTO Seller(present_address,permanent_address,nid,trade_license_no,company_name,short_description,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',[present_address,permanent_address,nid,trade_license_no,company_name,short_description,user_id.rows[0].user_id]);
    client.release(true)
    res.status(200).json({success: true,error: false,message: "Seller Registration successful",data: null});
})

router.get('/verify/:token',async(req,res)=> {
    try{
        const{phone_number}= jwt.verify(req.params.token,process.env.JWT_SECRET);
        const client = await pool.connect();
        await client.query('UPDATE Users SET verified=true WHERE phone_number=$1',[phone_number]);
        client.release(true);
        res.status(200).json({success: true,error: false,message: "Email verified successfully",data: null});
    }
    catch(e){
        res.status(500).json({success: false,error: true,message: "Token is invalid",data: null});
        return
    }
})

router.post('/otp',async(req,res)=> {
    const{phone_number}=req.body;
    var otp_pin = (getRndInteger(0,8)+1).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString()

    const otp_pin_token = await jwt.sign({ otp_pin: otp_pin }, process.env.JWT_SECRET, { expiresIn: '300s' });

    otpMap.set(phone_number,otp_pin_token);

    const from = "Vonage APIs"
    const to = `+88${phone_number}`
    const text = `Your otp is ${otp_pin}`

    console.log(otp_pin)

    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); })
        .catch(err => { console.error(err); });
})

module.exports = router;