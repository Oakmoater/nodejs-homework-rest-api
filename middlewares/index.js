const { isEmptyBody, isEmptyFavoriteBody, isEmptySubscriptionBody } = require('./isEmptyBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./uploads');

module.exports = { upload, isEmptyBody, isValidId, isEmptyFavoriteBody, authenticate, isEmptySubscriptionBody };