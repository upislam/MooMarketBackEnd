const express = require("express");
const router = express.Router();

const { pool } = require("../db");
router.get('/', async(req, res) => {
    if(req.session.phone_number){
        const client = await pool.connect();
        var output;
        output = await client.query('select type from Users WHERE phone_number=$1',[req.session.phone_number]);
        client.release(true);
        res.render('home',{session:req.session.phone_number,type:output.rows[0].type}) 
    }
    else{
        res.render('home',{session:req.session.phone_number}) 
    }
    
})

module.exports = router;