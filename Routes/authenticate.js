const express = require("express");
const router = express.Router();

const { pool } = require("../db");
const jwt = require('jsonwebtoken');

router.get('/', async(req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');

    const cookie = req.cookies['accessToken'];

    try{
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const client = await pool.connect();
        const user = await client.query("SELECT * FROM users WHERE phone_number=$1", [decoded.phone_number]);
        client.release(true);
        if(user.rows.length === 0){
            res.status(500).json({success: false,error: false,message: "No such user",data: null});
            return
        }
        else{
            res.status(200).json({success: true,error: false,message: "User authenticated",data: user.rows[0]});
            return
        }
    }
    catch(err){
        res.status(500).json({success: false,error: true,message: "JWT error",data: null});
        return
    }
})

module.exports = router;