const express = require("express");
const router = express.Router();

const multer=require("multer");

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        res.render('giveAdvertisement',{session:req.session.phone_number}) 
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;