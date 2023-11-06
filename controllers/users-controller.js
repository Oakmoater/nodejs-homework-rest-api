const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const gravatar = require('gravatar');
const path = require('path');
const Jimp = require('jimp');
const { HttpError, sendEmail } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const { User } = require('../models/User');
const { v4: uuidv4 } = require("uuid");

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
    const verificationToken = uuidv4();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    await sendEmail({ email, verificationToken: newUser.verificationToken });

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
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarPath, filename);
    try {
        const avatar = await Jimp.read(tempUpload);
        avatar.resize(250, 250).quality(70).write(resultUpload);
        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(_id, { avatarURL });
        res.json({
            avatarURL,
        });
    } catch {
        throw HttpError(500);
    }
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null,
    });

    res.json({
        message: "Verification successful",
    });
};

const resendEmail = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, "User not found");
    }

    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    await sendEmail({ email, verificationToken: user.verificationToken });

    res.json({ message: "Verification email sent" });
};

module.exports = {
    signup: ctrlWrapper(signup),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendEmail: ctrlWrapper(resendEmail),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    switchSubscription: ctrlWrapper(switchSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
