// const accountSid = 'AC20ee2e410c6fab586f959fc640155a79';
// const authToken = 'fc8f459529d9284605566d3efc720d7c';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your otp is 456789',
//         from: '+18134384603',
//         to: '+8801704953445'
//     })
//     .then(message => console.log(message.sid))

// function getRndInteger(min, max) {
//     return Math.floor(Math.random() * (max - min) ) + min;
//   }
// ggwp = (getRndInteger(0,8)+1).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString() +(getRndInteger(0,9)).toString()
// console.log(ggwp)


// const jwt = require('jsonwebtoken');
// const nodemailer=require('nodemailer');

// async function g(){
//     const emailToken = await jwt.sign({phone_number:44},'sfbshfjngkjnfbjesfkj56154jnfjndsf54454364kjfksnjdf',{expiresIn:'0h',})
    
//     try{
//         const gg = jwt.verify(emailToken,'sfbshfjngkjnfbjesfkj56154jnfjndsf54454364kjfksnjdf')
//     }
//     catch(e){
//         console.log('tt')
//     }
// }

// g()


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,    
//     secure: true, 
//     auth: {
//       user: 'moomarketweb@gmail.com',
//       pass: 'mkgfbqpdowexeszs',
//     },
//     tls:{
//       rejectUnauthorized:false
//   }
// });
// async function f(){
//     //console.log(emailToken)
//     const url =`http://localhost:3000/register/verify/gtfhyf`;
//     transporter.sendMail({
//         to: "nafiislamweb@gmail.com",
//         subject:'Confirm Email',
//         html: `<!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta http-equiv="X-UA-Compatible" content="IE=edge">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Confirm email</title>
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
//             <style>
//                 .button-24 {
//                     background: #FF4742;
//                     border: 1px solid #FF4742;
//                     border-radius: 6px;
//                     box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
//                     box-sizing: border-box;
//                     color: #FFFFFF;
//                     cursor: pointer;
//                     display: inline-block;
//                     font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
//                     font-size: 16px;
//                     font-weight: 800;
//                     line-height: 16px;
//                     min-height: 40px;
//                     outline: 0;
//                     padding: 12px 14px;
//                     text-align: center;
//                     text-rendering: geometricprecision;
//                     text-transform: none;
//                     user-select: none;
//                     -webkit-user-select: none;
//                     touch-action: manipulation;
//                     vertical-align: middle;
//                     }
                    
//                     .button-24:hover,
//                     .button-24:active {
//                     background-color: initial;
//                     background-position: 0 0;
//                     color: #FF4742;
//                     }
                    
//                     .button-24:active {
//                     opacity: .5;
//                     }
//                 </style>    
//             </head>
//             <body>
//             <div class="row">
//             <img src="http://drive.google.com/uc?export=view&id=11d1JZCNOu-B69BjTYC1MjwEIhDJr5bUm" class="img-thumbnail mx-auto my-auto" style="width:800px;height:600px;align-items:center">
//             </div>
//             <div class="row">
//                 <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to verify email</button></a>
//                 <p style="margin: auto;padding: 10px; font-size: 20px;">Please click this to verify your email: <a href="${url}">${url}</a></p>
//             </div>
//             <script
//             src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
//             integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
//             crossorigin="anonymous"
//             ></script>
//         </body>
//         </html>`,
//     }); 
//     console.log('email sent')

//     console.log('after email sent')
// }

// f()

// async function reg(){
//     const bcrypt = require('bcrypt');

//     const salt = await bcrypt.genSalt(10);
//     password = await bcrypt.hash('pppppppp', salt);
//     console.log(password)
// }

// reg()

// const { Vonage } = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "61b65c70",
//   apiSecret: "55JkOEfF1Arvuasi"
// })

// const from = "Vonage APIs"
// const to = "8801704953445"
// const text = 'A text message sent using the Vonage SMS API'

// async function sendSMS() {
//     await vonage.sms.send({to, from, text})
//         .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//         .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
// }

// sendSMS();

// Initialize an empty array to store the objects
const coordinatesArray = [];

// Define the number of objects you want in the array
const numberOfObjects = 5; // You can change this to the desired number

// Use a for loop to generate and push objects into the array
for (let i = 0; i < numberOfObjects; i++) {
    const lng = Math.random() * 360 - 180; // Generates a random longitude between -180 and 180
    const lat = Math.random() * 180 - 90;  // Generates a random latitude between -90 and 90

    const coordinates = { lng, lat };
    coordinatesArray.push(coordinates);
}

// Print the resulting array
console.log(coordinatesArray);
