const express = require('express');

const controllers = require('../../controllers/users-controller');
const { userSignupSchema, userSigninSchema } = require('../../models/User');
const { isEmptyBody} = require('../../middlewares');
const { validateBody } = require('../../decorators');

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, userSignupValidate, controllers.signup)

authRouter.post('/login', isEmptyBody, userSigninValidate, controllers.signin)

// POST /users/logout

// GET /users/current

module.exports = authRouter;