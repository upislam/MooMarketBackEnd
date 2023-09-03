const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const { pool } = require("../db");

router.get('/', async(req, res) => {
    res.render('login')
})

router.post('/', async(req, res) => {
    var {phone_number, password} = req.body;

    const client = await pool.connect();
    const r = await client.query('SELECT password FROM Users WHERE phone_number=$1', [phone_number]);
    client.release(true)

    bcrypt.compare(password,r.rows[0].password , function(err, result) {
        if(result){

            const client = pool.connect();
            var verified = client.query('select verified from Users WHERE phone_number=$1',[phone_number]);
            client.release(true);
            if(verified == true){
                req.session.phone_number = phone_number;
                res.render('output',{msg:"Login successful"})
            }
            else{
                res.render('output',{msg:"Please verify your email"})
            }
        }
        else{
            res.render('output',{msg:"Login failed"})
        }
    });
})

module.exports = router;