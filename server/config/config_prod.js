module.exports = {
    MONGO_URI: String(process.env.MONGO_URI),
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_TOKEN_EXPIRATION: Number(process.env.JWT_TOKEN_EXPIRATION),
    SESSION_SECRET: String(process.env.SESSION_SECRET),
    SESSION_EXPIRATION: Number(process.env.SESSION_EXPIRATION),
    PORT: Number(process.env.PORT)
};
