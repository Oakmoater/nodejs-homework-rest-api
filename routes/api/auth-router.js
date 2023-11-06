const express = require('express');

const controllers = require('../../controllers/users-controller');
const { userJoiSchema, userUpdateSubscriptionSchema } = require('../../models/User');
const { isEmptyBody, authenticate, isEmptySubscriptionBody, upload } = require('../../middlewares');
const { validateBody } = require('../../decorators');

const userSignValidate = validateBody(userJoiSchema);
const userUpdateSubscriptionValidate = validateBody(userUpdateSubscriptionSchema);

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, userSignValidate, controllers.signup);

authRouter.get('/verify/:verificationToken', controllers.verifyEmail);

authRouter.post('/login', isEmptyBody, userSignValidate, controllers.signin);

authRouter.get('/current', authenticate, controllers.getCurrent);

authRouter.post('/logout', authenticate, controllers.logout);

authRouter.patch('/', authenticate, isEmptySubscriptionBody, userUpdateSubscriptionValidate, controllers.switchSubscription);

authRouter.patch('/avatars', upload.single('avatar'), authenticate, controllers.updateAvatar);

module.exports = authRouter;