const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const Contact = require('../models/Contact');
const fs = require('fs/promises');
const path = require('path');

const avatarPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite = false } = req.query;
    const skip = (page - 1) * limit;
    const query = { owner };
    if (favorite) {
        query.favorite = true;
    }
    const result = await Contact.find(query, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");
    res.json(result);
};

const getContactById = async (req, res) => {
    const { id } = req.params;
    // const result = await Contact.findOne({ _id: id });
    const result = await Contact.findById( id );
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL  = path.join("avatars", filename)
    const result = await Contact.create({ ...req.body, avatarURL, owner });
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const removeContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json({ "message": "contact deleted" });
};

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    removeContact: ctrlWrapper(removeContact),
};