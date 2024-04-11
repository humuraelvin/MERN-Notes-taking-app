const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel')

const authMiddleware = async (res, req, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if (Authorization && Authorization.startswith("Bearer")) {
        const token = Authorization.split(' ')[1]
        jwt.verify(token, "jaihfaiaAIJROfkjaofjiIRJEWKDd", (err, info) => {
            if (err) {
                return next(new HttpError("Unauthorized. Invalid token. ", 403))
            }

            req.user = info;
            next();
        })
    } else {
        return next(new HttpError("Unauthorized. No token", 402))
    }

}

module.exports = authMiddleware;