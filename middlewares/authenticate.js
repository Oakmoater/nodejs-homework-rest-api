const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

dotenv.config();

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    const veryfiedToken = jwt.verify(token, JWT_SECRET);

    console.log(veryfiedToken);

    if (bearer !== "Bearer") {
        throw HttpError(401, 'No token');
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user) {
            throw HttpError(401, 'No user found');
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, 'Token not valid'));
    }
}

module.exports = ctrlWrapper(authenticate);