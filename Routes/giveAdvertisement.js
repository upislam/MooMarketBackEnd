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

function replacer(st){//replaces ' with '' for sql
    if(st){
        s =''
        for (let i=0;i<st.length;i++){
            if(st[i]=='\'')
                s+="''";
            else{
                s+=st[i];
            }
        }
        return s;
    }
    return st;
}

router.post('/cattle', upload.fields([
    { name: 'picture_front_view' },{name:'picture_left_view'},{name:'picture_right_view'},{name:'picture_back_view'},{name:'video'}
]), async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=='seller'){
            const location='./public/submittedPictures/';
            const {quantity,description,price,farm_name,bidding}=req.body;

            const client = await pool.connect();
            if(parseInt(price)>=100000){
                await client.query('INSERT INTO Advertisements(description,status,type,verified,quantity,seller_id) VALUES ($1,\'unfinished\',\'cattle\',false,$2,(select user_id from Users where phone_number = $3))',[description,quantity,req.session.phone_number]);
            }
            else{
                await client.query('INSERT INTO Advertisements(description,status,type,quantity,seller_id) VALUES ($1,\'unfinished\',\'cattle\',$2,(select user_id from Users where phone_number = $3))',[description,quantity,req.session.phone_number]);
            }
            if(bidding=="yes"){
                await client.query('INSERT INTO Cattle_Advertisement(price,farm_name,is_bid,advertise_id) VALUES ($1,$2,true,(select max(advertise_id) from Advertisements))',[price,farm_name]);
            }
            else{
                await client.query('INSERT INTO Cattle_Advertisement(price,farm_name,is_bid,advertise_id) VALUES ($1,$2,false,(select max(advertise_id) from Advertisements))',[price,farm_name]);
            }
            for(let i=0;i<quantity;i++) {
                if(req.body['veterinary_verified'+i]=="yes"){
                    const q=`INSERT INTO Cattle(age,color,weight,gender,veterinary_verified,picture_front_view_url,picture_left_view_url,picture_right_view_url,picture_back_view_url,video_url,cattle_advertise_id) VALUES (${req.body['age'+i]},'${replacer(req.body['color'+i])}',${req.body['weight'+i]},'${req.body['gender'+i]}',true,'${location+req.files['picture_front_view'][i].filename}','${location+req.files['picture_left_view'][i].filename}','${location+req.files['picture_right_view'][i].filename}','${location+req.files['picture_back_view'][i].filename}','${location+req.files['video'][i].filename}',(select max(advertise_id) from Advertisements))`
                    await client.query(q);
                }
                else{
                    const q=`INSERT INTO Cattle(age,color,weight,gender,veterinary_verified,picture_front_view_url,picture_left_view_url,picture_right_view_url,picture_back_view_url,video_url,cattle_advertise_id) VALUES (${req.body['age'+i]},'${replacer(req.body['color'+i])}',${req.body['weight'+i]},'${req.body['gender'+i]}',false,'${location+req.files['picture_front_view'][i].filename}','${location+req.files['picture_left_view'][i].filename}','${location+req.files['picture_right_view'][i].filename}','${location+req.files['picture_back_view'][i].filename}','${location+req.files['video'][i].filename}',(select max(advertise_id) from Advertisements))`
                    await client.query(q);
                }
            }
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