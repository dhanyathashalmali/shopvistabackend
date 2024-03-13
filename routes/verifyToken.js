const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeaders = req.headers.token

    if (authHeaders) {
        const token = authHeaders.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                res.status(403).json("Token is not correct")
            } else {
                console.log(user);
                req.user = user
            } next()
        })
    } else {
        return res.status(401).json("You are not authenticated")
    }
}


const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) {
            return res.status(401).json("You are not authenticated");
        }

        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json("You are not allowed to access this");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) {
            return res.status(401).json("You are not authenticated");
        }

        if (req.user.isAdmin) {
            console.log(req.user.isAdmin)
            next();
        } else {
            return res.status(403).json("You are not allowed to access this");
        }
    });
};


module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };