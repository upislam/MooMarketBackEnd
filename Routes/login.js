const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    res.render('login')
})

router.post('/', async(req, res) => {
    var {phone_number, password} = req.body;
    const client = await pool.connect();
    const r = await client.query('SELECT password FROM Users WHERE phone_number=$1', [phone_number]);
    client.release(true)
    if(r.rows[0].password==password){
        req.session.phone_number = phone_number;
        res.render('output',{msg:"Login successful"})
    }
    else{
        res.render('output',{msg:"Login failed"})
    }
    
})

module.exports = router;