const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded.user;
        next();
    });       

}