const HandleSaveError = (error, date, next) => {
    const { name, code } = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    next()
};

const runValidatorsAtUpdate = function (next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
};

module.exports = {HandleSaveError, runValidatorsAtUpdate};