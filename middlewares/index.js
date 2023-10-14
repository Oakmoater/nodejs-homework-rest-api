const { isEmptyBody, isEmptyFavoriteBody, isEmptySubscriptionBody } = require('./isEmptyBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');

module.exports = { isEmptyBody, isValidId, isEmptyFavoriteBody, authenticate, isEmptySubscriptionBody };