const mongoose = require("mongoose");
const mongoURI = require("../config").MONGO_URI;
mongoose.Promise = global.Promise;

mongoose
    .connect(
        mongoURI,
        { useNewUrlParser: true }
    )
    .then(
        () => {
            console.log("MONGO_DB: Connected");
        },
        err => {
            console.log("MONGO_DB: Error when connecting:");
            console.log(err);
        }
    );

module.exports = mongoose.connection;
