const jwt = require("jsonwebtoken");

const authorizationToken = (req, res, next) => {
    const authHeader = req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({message: "Token required!!"});

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({message: "Invalid token"});

        req.user = user;
        next();
    });
};


module.exports = { authorizationToken };
