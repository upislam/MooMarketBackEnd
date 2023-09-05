const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            const meatAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN meat_advertisement WHERE advertisements.verified=false");
            const cattleAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertisements.verified=false");
            const rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertisements.verified=false");
            const hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertisements.verified=false");
            const hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertisements.verified=false");
            client.release(true);
            res.render('advertisementVerify',{session:req.session.phone_number,meatAdvertisements:meatAdvertisements.rows,cattleAdvertisements:cattleAdvertisements.rows,rawhideAdvertisements:rawhideAdvertisements.rows,hornAdvertisements:hornAdvertisements.rows,hoofAdvertisements:hoofAdvertisements.rows}) 
        }
        else{
            res.render('output',{msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;