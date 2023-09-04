const express = require("express");
const router = express.Router();

const multer=require("multer");
const path=require("path")

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=='seller')
            res.render('giveAdvertisement',{session:req.session.phone_number})
        else{
            res.render('output',{msg:"You are not a seller"})
        }
    }
    else{
        res.redirect('/login');
    }
})

router.post('/type', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=='seller'){
            if(req.body.type=='meat')
                res.render('giveMeatAdvertisement',{session:req.session.phone_number})
            else if(req.body.type=='cattle')
                res.render('giveCattleAdvertisement',{session:req.session.phone_number})
            else if(req.body.type=='rawhide')
                res.render('giveRawhideAdvertisement',{session:req.session.phone_number})
            else if(req.body.type=='horn')
                res.render('giveHornAdvertisement',{session:req.session.phone_number})
            else if(req.body.type=='hoof')
                res.render('giveHoofAdvertisement',{session:req.session.phone_number})
        }
        else{
            res.render('output',{msg:"You are not a seller"})
        }
    }
    else{
        res.redirect('/login');
    }
})

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/submittedPictures");
    },
    filename:(req,file,cb)=>{
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                                .replace(fileExt,"")
                                .toLowerCase()
                                .split(" ")
                                .join("-")+ "-" +Date.now();
        cb(null,fileName+fileExt);
    },
});

var upload=multer({ 
    storage:storage,
    limits:{
        fileSize:100000000//100mb
    },
});

router.post('/meat',upload.single("picture"), async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=='seller'){
            const location='./public/submittedPictures/'+req.file.filename;
            const {type,quantity,price_per_kg,date_of_storage,date_of_expiry,description,}=req.body;

            const client = await pool.connect();
            if(parseInt(quantity)*parseInt(price_per_kg)>=100000){
                await client.query('INSERT INTO Advertisements(description,status,type,verified,quantity,seller_id) VALUES ($1,\'unfinished\',\'meat\',false,$2,(select user_id from Users where phone_number = $3))',[description,quantity,req.session.phone_number]);
            }
            else{
                await client.query('INSERT INTO Advertisements(description,status,type,quantity,seller_id) VALUES ($1,\'unfinished\',\'meat\',$2,(select user_id from Users where phone_number = $3))',[description,quantity,req.session.phone_number]);
            }
            await client.query('INSERT INTO Meat_Advertisement(type,price_per_kg,date_of_storage,date_of_expiry,picture_url,advertise_id) VALUES ($1,$2,$3,$4,$5,(select max(advertise_id) from Advertisements))',[type,price_per_kg,date_of_storage,date_of_expiry,location]);
            client.release(true);
            res.render('output',{msg:"Advertisement submitted successfully"})
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