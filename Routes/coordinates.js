const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.post('/', async(req, res) => {
    const {thana} = req.body;
    const client = await pool.connect();
    const thana_id = await client.query("SELECT thana_id FROM thana WHERE name=$1", [thana]);
    const coordinates = await client.query("SELECT * FROM coordinates WHERE thana_id=$1", [thana_id.rows[0].thana_id]);
    client.release(true);
    res.send(coordinates.rows)
})

module.exports = router;