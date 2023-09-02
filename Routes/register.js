const express = require("express");
const router = express.Router();

const { pool } = require("../db");
router.get('/', async(req, res) => {
    res.render('buyerRegister') 
})
router.get('/seller', async(req, res) => {
    res.render('sellerRegister') 
})
router.get('/buyer', async(req, res) => {
    res.render('buyerRegister') 
})

router.get('/districts', async(req, res) => {
    const client = await pool.connect();
    const r = await client.query('SELECT name FROM District');
    client.release(true);
    res.send(r.rows);
})

router.get('/phoneNumbers', async(req, res) => {
    const client = await pool.connect();
    const r = await client.query('SELECT phone_number FROM Users');
    client.release(true);
    res.send(r.rows);
})

router.post('/thanas', async(req, res) => {
    var {district} = req.body;
    const client = await pool.connect();
    const r = await client.query('SELECT Thana.name FROM District JOIN Thana on District.district_id=Thana.district_id where District.name= $1', [district]);
    client.release(true)
    res.send(r.rows);
})

router.post('/buyersubmit', async(req, res) => {
    var {name, email, password, phone_number, birth_date, thana, delivery_address,nid} = req.body;
    const client = await pool.connect();
    await client.query('INSERT INTO Users(name,email,phone_number,password,birth_date,updated_at,thana_id) VALUES ($1,$2,$3,$4,$5,NULL,get_thana_id($6))', [name, email, phone_number, password, birth_date, thana]);
    if(nid)
        await client.query('INSERT INTO Buyer(delivery_address,nid,user_id) VALUES ($1,$2,(select max(user_id) from Users))', [delivery_address, nid]);
    else
        await client.query('INSERT INTO Buyer(delivery_address,user_id) VALUES ($1,(select max(user_id) from Users))', [delivery_address]);
    client.release(true)
    res.render('output',{msg:'Buyer Registration successful'}) 
})

router.post('/sellersubmit', async(req, res) => {
    var {name, email, password, phone_number, birth_date, thana,nid,trade_license_no,company_name,present_address,permanent_address,short_description} = req.body;
    const client = await pool.connect();
    await client.query('INSERT INTO Users(name,email,phone_number,password,birth_date,updated_at,thana_id) VALUES ($1,$2,$3,$4,$5,NULL,get_thana_id($6))', [name, email, phone_number, password, birth_date, thana]);
    await client.query('INSERT INTO Seller(present_address,permanent_address,nid,trade_license_no,company_name,short_description,user_id) VALUES ($1,$2,$3,$4,$5,$6,(select max(user_id) from Users))',[present_address,permanent_address,nid,trade_license_no,company_name,short_description]);
    client.release(true)
    res.render('output',{msg:'Seller Registration successful'}) 
})

module.exports = router;