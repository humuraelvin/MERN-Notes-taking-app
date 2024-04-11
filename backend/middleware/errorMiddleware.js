const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error)
}

const errorHandler = (req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500).json({ message: error.message || "Internal Server Error"});

}


module.exports = {notFound, errorHandler}