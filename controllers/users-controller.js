const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const { User } = require('../models/User');

dotenv.config();

const { JWT_SECRET } = process.env;


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `${email} already in use`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })

}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    res.json({
        token,
    })
}

module.exports = {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
}