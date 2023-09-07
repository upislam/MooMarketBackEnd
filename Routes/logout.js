const express = require("express");
const router = express.Router();

router.get('/', async(req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');

    res.cookie('accessToken',{maxAge: 0,httpOnly: true,secure: true,sameSite: "none"})
    res.clearCookie('accessToken');
    res.status(200).json({success: true,error: false,message: "Logout successful",data: null});
})

module.exports = router;