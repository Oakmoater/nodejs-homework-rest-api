const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { HandleSaveError, runValidatorsAtUpdate } = require("./hooks");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
    },
    avatarURL: {
        type: String,
    },
    token: {
        type: String,
    }
}, { versionKey: false, timestamps: true })

userSchema.post("save", HandleSaveError);

userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

userSchema.post("findOneAndUpdate", HandleSaveError);

const User = model("user", userSchema);

const userJoiSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userUpdateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
})

module.exports = { User, userJoiSchema, userUpdateSubscriptionSchema };