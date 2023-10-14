const { HttpError } = require('../helpers');

const isEmptyBody = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return next(HttpError(400, 'Missing fields'));
    }
    next();
};

const isEmptyFavoriteBody = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return next(HttpError(400, 'Missing field favorite'));
    }
    next();
};

const isEmptySubscriptionBody = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return next(HttpError(400, 'Missing field subscription'));
    }
    next();
}

module.exports = { isEmptyBody, isEmptyFavoriteBody, isEmptySubscriptionBody };