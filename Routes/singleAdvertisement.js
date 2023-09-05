const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/buyer/:id', async(req, res) => {
    var advertisement;
    const client = await pool.connect();
    const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
    if(type.rows[0].type=="meat"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN meat_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="cattle"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="rawhide"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="horn"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="hoof"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    client.release(true);
    res.render('singleAdvertisementBuyer',{session:req.session.phone_number,advertisement:advertisement.rows[0]})
})

router.get('/seller/:id', async(req, res) => {
    var advertisement;
    const client = await pool.connect();
    const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
    if(type.rows[0].type=="meat"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN meat_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="cattle"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="rawhide"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="horn"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="hoof"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    client.release(true);
    res.render('singleAdvertisementSeller',{session:req.session.phone_number,advertisement:advertisement.rows[0]})
})

router.get('/admin/:id', async(req, res) => {

    if(req.session.phone_number){
        if(req.session.type=="admin"){
            var advertisement;
            const client = await pool.connect();
            const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            if(type.rows[0].type=="meat"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN meat_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="cattle"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="rawhide"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="horn"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="hoof"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            client.release(true);
            res.render('singleAdvertisementAdmin',{session:req.session.phone_number,advertisement:advertisement.rows[0]})
        }
        else{
            res.render('output',{msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

router.get('/admin/reject/:id', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            if(type.rows[0].type=="meat"){
                await client.query("DELETE FROM meat_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="cattle"){
                await client.query("DELETE FROM cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="rawhide"){
                await client.query("DELETE FROM rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="horn"){
                await client.query("DELETE FROM horn_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="hoof"){
                await client.query("DELETE FROM hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            await client.query("DELETE FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            client.release(true);
            res.render('output',{msg:"Advertisement Rejected"})
        }
        else{
            res.render('output',{msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

router.get('/admin/accept/:id', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            await client.query("UPDATE advertisements set verified=true WHERE advertise_id=$1", [req.params.id]);
            client.release(true);
            res.render('output',{msg:"Advertisement accepted"})
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