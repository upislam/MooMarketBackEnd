const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="seller"){
            const client = await pool.connect();
            const meatAdvertisements = await client.query("SELECT * FROM advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const cattleAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN (cattle_advertisement JOIN cattle ON advertise_id=cattle_advertise_id) WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            client.release(true);
            res.render('myAdvertisements',{session:req.session.phone_number,meatAdvertisements:meatAdvertisements.rows,cattleAdvertisements:cattleAdvertisements.rows,rawhideAdvertisements:rawhideAdvertisements.rows,hornAdvertisements:hornAdvertisements.rows,hoofAdvertisements:hoofAdvertisements.rows}) 
        }
        else{
            res.render('output',{msg:"You are not a seller"})
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;