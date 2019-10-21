const express = require('express');
const router = express.Router();

const User = require('../models/user');

/* GET user profile. */
router.get('/',function(req, res, next) {

    const user = req.user;
    if (user) {
        const info = {
            id: user.id,
            email: user.email,
            fullName: user.fullName 
        }
        res.status(200).json(info);
    }
    else{
        res.status(400).json({
            message: err.info
        })
    }
})

module.exports = router;