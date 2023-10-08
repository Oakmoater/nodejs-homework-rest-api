const { Schema, model } = require("mongoose");
const { HandleSaveError, runValidatorsAtUpdate } = require("./hooks");

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
}, {versionKey: false, timestamps: true});

contactSchema.post("save", HandleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", HandleSaveError);

const Contact = model("contact", contactSchema);

module.exports = Contact; 