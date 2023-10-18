const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/User');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

dotenv.config();

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
        throw HttpError(401);
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, "Not authorized"));
    }
}

module.exports = ctrlWrapper(authenticate);