const express = require('express');

const controllers = require('../../controllers/contacts-controller');
const { contactAddSchema, contactUpdateFavoriteSchema } = require('../../schemas/contact-schemas');
const { isEmptyBody, isEmptyFavoriteBody, isValidId, authenticate, upload } = require('../../middlewares');
const { validateBody } = require('../../decorators');

const contactsRouter = express.Router();

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

contactsRouter.use(authenticate);

contactsRouter.get('/', controllers.getAllContacts);

contactsRouter.get('/:id', isValidId, controllers.getContactById);

contactsRouter.post('/', upload.single('avatar'), isEmptyBody, contactAddValidate, controllers.addContact);

contactsRouter.put('/:id', isValidId, isEmptyBody, contactAddValidate, controllers.updateContact);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyFavoriteBody, contactUpdateFavoriteValidate, controllers.updateContact);

contactsRouter.delete('/:id', isValidId, controllers.removeContact);

module.exports = contactsRouter;