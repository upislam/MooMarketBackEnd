const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        const client = await pool.connect();
        const meatAdvertisements = await client.query("SELECT * FROM advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id");
        const cattleAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN (cattle_advertisement JOIN cattle ON advertise_id=cattle_advertise_id)");
        const rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement");
        const hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement");
        const hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement");
        client.release(true);
        res.render('home',{session:req.session.phone_number,type:req.session.type,meatAdvertisements:meatAdvertisements.rows,cattleAdvertisements:cattleAdvertisements.rows,rawhideAdvertisements:rawhideAdvertisements.rows,hornAdvertisements:hornAdvertisements.rows,hoofAdvertisements:hoofAdvertisements.rows}) 
    }
    else{
        res.render('home',{session:req.session.phone_number}) 
    }
})

router.get('/category/:category', async(req, res) => {
    if(req.session.phone_number){
        var meatAdvertisements,cattleAdvertisements,rawhideAdvertisements,hornAdvertisements,hoofAdvertisements;
        if(req.params.category=="meat"){
            const client = await pool.connect();
            meatAdvertisements = await client.query("SELECT * FROM advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id");
            client.release(true);
            res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:meatAdvertisements.rows}) 
        }
        else if(req.params.category=="cattle"){
            const client = await pool.connect();
            cattleAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN (cattle_advertisement JOIN cattle ON advertise_id=cattle_advertise_id)");
            client.release(true);
            res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:cattleAdvertisements.rows}) 
        }
        else if(req.params.category=="rawhide"){
            const client = await pool.connect();
            rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement");
            client.release(true);
            res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:rawhideAdvertisements.rows}) 
        }
        else if(req.params.category=="horn"){
            const client = await pool.connect();
            hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement");
            client.release(true);
            res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:hornAdvertisements.rows}) 
        }
        else if(req.params.category=="hoof"){
            const client = await pool.connect();
            hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement");
            client.release(true);
            res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:hoofAdvertisements.rows}) 
        }
    }
    else{
        res.render('home',{session:req.session.phone_number}) 
    }
})

module.exports = router;