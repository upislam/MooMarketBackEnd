const { pool } = require("./db");
const jwt = require('jsonwebtoken');

async function authenticate(cookie) {
    try{
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const client = await pool.connect();
        const user = await client.query("SELECT * FROM users WHERE phone_number=$1", [decoded.phone_number]);
        client.release(true);
        if(user.rows.length === 0){
            return false;
        }
        else{
            return true;
        }
    }
    catch(err){
        return false;
    }
}

async function authenticate2(cookie) {
    try{
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const client = await pool.connect();
        const user = await client.query("SELECT * FROM users WHERE phone_number=$1", [decoded.phone_number]);
        client.release(true);
        if(user.rows.length === 0){
            return null;
        }
        else{
            return user.rows[0];
        }
    }
    catch(err){
        return null;
    }
}

module.exports.authenticate = authenticate;
module.exports.authenticate2 = authenticate2;