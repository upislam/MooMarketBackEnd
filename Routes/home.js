const express = require("express");
const router = express.Router();

const { pool } = require("../db");
router.get('/', async(req, res) => {
    if(req.session.phone_number){
        res.render('home',{session:req.session.phone_number,type:req.session.type}) 
    }
    else{
        res.render('home',{session:req.session.phone_number}) 
    }
})


module.exports = router;