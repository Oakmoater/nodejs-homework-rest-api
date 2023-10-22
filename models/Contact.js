const { Schema, model } = require("mongoose");
const { HandleSaveError, runValidatorsAtUpdate } = require("./hooks");
const { string } = require("joi");

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'Set phone number for contact'],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    avatarURL: {
        type: string,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    }
}, {versionKey: false, timestamps: true});

contactSchema.post("save", HandleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", HandleSaveError);

const Contact = model("contact", contactSchema);

module.exports = Contact; 