const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const secret = process.env.JWT_SECRET || 'no BE and no FE makes kim a dull girl';
    if (authorization) {
        jwt.verify(authorization, secret, function(err, decodedToken) {
            if (err) {
                res.status(401).json({message: 'invalid token. You shall not pass!'})
            } else {
                req.token = decodedToken //so anything downstream can access the data in the token
                next();
            }
        })
    } else {
        res.status(400).json({message: 'Please login and try again'})
    }
};