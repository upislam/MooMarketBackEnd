
const express = require("express");
const router = express.Router();

const { pool } = require("../db");
router.get('/', async(req, res) => {
    const client = await pool.connect();
    const r = await client.query('SELECT * FROM Users');
    client.release(true);
    res.render('home',{rows:r.rows}) 
})

module.exports = router;