const express = require("express");
const router = express.Router();

const { pool } = require("../db");
router.get('/', async(req, res) => {
    const client = await pool.connect();
    const r = await client.query('SELECT * FROM Users');
    client.release(true);
    res.render('home',{session:req.session.phone_number}) 
})

module.exports = router;