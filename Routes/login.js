const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');

const { pool } = require("../db");
const { authenticate } = require("../authenticate");

router.post('/', async(req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');

    var auth = await  authenticate(req.cookies['accessToken'])
    if(auth){
        res.status(500).json({success: false,error: false,message: "Already logged in",data: null});
        return
    }
    var {phone_number, password} = req.body;

    if(phone_number == "" || password == ""){
        res.status(500).json({success: false,error: false,message: "Phone number or password is undefined",data: null});
        return
    }
    
    const client = await pool.connect();
    const r = await client.query('SELECT password FROM Users WHERE phone_number=$1', [phone_number]);
    client.release(true)

    if(r.rows.length == 0){
        res.status(500).json({success: false,error: false,message: "No such phone_number is registered",data: null});
        return
    }
    bcrypt.compare(password,r.rows[0].password , async function(err, result) {
        if(result){
            const client = await pool.connect();
            var verified = await client.query('select verified from Users WHERE phone_number=$1',[phone_number]);
            client.release(true);
            if(verified.rows[0].verified == true){
                const client = await pool.connect();
                var type = await client.query('select type from Users WHERE phone_number=$1',[phone_number]);
                client.release(true);

                const accessToken = await jwt.sign({phone_number:phone_number,type:type.rows[0].type},process.env.JWT_SECRET,{expiresIn:'1h',})

                res.cookie('accessToken',accessToken,{maxAge: 1*60*60*1000,httpOnly: true,secure: true,sameSite: "none"})
                res.status(200).json({success: true,error: false,message: "Login successful",data: null});
                return
            }
            else{
                res.status(500).json({success: false,error: false,message: "Please verify your email",data: null});
                return
            }
        }
        else{
            res.status(500).json({success: false,error: false,message: "Password not match",data: null});
            return
        }
    });
})

router.post('/forgetPassword', async(req, res) => {
    var {phone_number} = req.body;

    const client = await pool.connect();
    var email = await client.query('select email from Users WHERE phone_number=$1',[phone_number]);
    if(email.rows.length == 0){
        res.status(500).json({success: false,error: false,message: "Phone number not found",data: null});
        return
    }
    email = email.rows[0].email;
    client.release(true);

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
    console.log(emailToken)
    
    const url =`${process.env.DOMAIN}/forgetPassword/verify/${emailToken}`;
    transporter.sendMail({
        to: email,
        subject:'Forget password',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forget password</title>
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
                <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to get Password</button></a>
                <p style="margin: auto;padding: 10px; font-size: 20px;">Please click to get Password: <a href="${url}">${url}</a></p>
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
        res.status(500).json({success: false,error: false,message: "Email was wrong",data: null});
        return
    });
    res.status(200).json({success: true,error: false,message: "Check email",data: null});
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

router.get('/forgetPassword/verify/:token',async(req,res)=> {
    try{
        const{phone_number}=jwt.verify(req.params.token,process.env.JWT_SECRET);
        var newPassword = (getRndInteger(0,8)+1).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString()
        const salt = await bcrypt.genSalt(parseInt((process.env.SALT)));
        var newPasswordHash = await bcrypt.hash(newPassword, salt);

        const client = await pool.connect();
        await client.query('UPDATE Users SET password=$1 WHERE phone_number=$2',[newPasswordHash,phone_number]);
        client.release(true);
        res.status(200).json({success: true,error: false,message: `New password: ${newPassword}`,data: null});
    }
    catch(e){
        res.status(500).json({success: false,error: true,message: "Token is invalid",data: null});
        return
    }
})

module.exports = router;