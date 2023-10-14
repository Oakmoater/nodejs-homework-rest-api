const express = require('express');

const controllers = require('../../controllers/users-controller');
const { userJoiSchema } = require('../../models/User');
const { isEmptyBody, authenticate } = require('../../middlewares');
const { validateBody } = require('../../decorators');

const userSignValidate = validateBody(userJoiSchema);

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, userSignValidate, controllers.signup);

authRouter.post('/login', isEmptyBody, userSignValidate, controllers.signin);

authRouter.get('/current', authenticate, controllers.getCurrent);

authRouter.post('/logout', authenticate, controllers.logout);

module.exports = authRouter;