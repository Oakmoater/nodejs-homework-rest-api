const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const { User } = require('../models/User');

dotenv.config();
const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");


const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `${email} already in use`);
    }
    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
    });
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({
        message: "Logout success"
    })
}

const switchSubscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
    res.json({
        email: updatedUser.email,
        subscription: updatedUser.subscription,
    });
}

const updateAvatar = async (req, res) => {
    // const addContact = async (req, res) => {
    // const { _id: owner } = req.user;
    // const { path: oldPath, filename } = req.file;
    // const newPath = path.join(avatarPath, filename);
    // await fs.rename(oldPath, newPath);
    // const avatarURL  = path.join("avatars", filename)
    // const result = await Contact.create({ ...req.body, avatarURL, owner });
    // res.status(201).json(result);
}

module.exports = {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    switchSubscription: ctrlWrapper(switchSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
