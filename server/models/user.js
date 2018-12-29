const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ObjectID = require("mongodb").ObjectID;
const Schema = mongoose.Schema;

mongoose.promise = Promise;

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: false
    },
    password: {
        type: String,
        unique: false,
        required: false
    },
    points: {
        type: Number,
        unique: false,
        required: false,
        default: 0
    },
    total_points: {
        type: Number,
        unique: false,
        required: false,
        default: 0
    },
    isOnline: {
        type: Boolean,
        unique: false,
        required: false,
        default: false
    },
    activeQuizId: {
        type: String,
        unique: false,
        required: false,
        default: ""
    }
});

userSchema.methods = {
    checkPassword: function(inputPassword) {
        return bcrypt.compareSync(inputPassword, this.password);
    },
    hashPassword: plainTextPassword => {
        return bcrypt.hashSync(plainTextPassword, 10);
    }
};

userSchema.pre("save", function(next) {
    if (!this.password) {
        return next();
    }

    this.password = this.hashPassword(this.password);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

module.exports.incrementPoint = (userId, callback) =>
    User.findOneAndUpdate(
        { _id: new ObjectID(userId) },
        {
            $inc: {
                points: 1
            }
        },
        callback
    );

module.exports.getByActiveQuizId = (quizId, callback) =>
    User.find(
        { activeQuizId: quizId },
        {
            _id: true,
            name: true,
            points: true
        },
        callback
    );

module.exports.reset = (userId, callback) =>
    User.findOneAndUpdate(
        { _id: new ObjectID(userId) },
        {
            $set: {
                activeQuizId: null,
                points: 0
            }
        },
        { new: true },
        callback
    );

module.exports.calculateTotalPoints = (userId, callback) =>
    User.findOne({ _id: new ObjectID(userId) }, (err, user) =>
        User.findOneAndUpdate(
            { _id: new ObjectID(userId) },
            {
                $set: {
                    points: 0,
                    total_points: user.total_points + user.points
                }
            },
            callback
        )
    );

module.exports.joinQuiz = (userId, quizId, callback) =>
    User.findOneAndUpdate(
        { _id: new ObjectID(userId) },
        {
            $set: {
                activeQuizId: quizId,
                points: 0
            }
        },
        { new: true },
        (err, user) => {
            if (err) {
                return callback(err);
            }

            if (user === null) {
                return callback("Error when joining quiz");
            }

            return callback(err, user);
        }
    );
