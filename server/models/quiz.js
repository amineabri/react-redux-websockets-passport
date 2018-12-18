const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;

const Schema = mongoose.Schema;
mongoose.promise = Promise;

const quizSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    maxUsersCount: {
        type: Number,
        default: 2
    },
    users: {
        type: Array,
        default: []
    },
    questions: {
        type: Array,
        required: true
    }
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;

module.exports.create = (params, callback) => new Quiz(params).save(callback);

module.exports.getAll = callback => Quiz.find(callback);

module.exports.getById = (quizId, callback) => Quiz.findOne(
    {_id: new ObjectID(quizId)},
    callback
);

module.exports.getUsers = (quizId, callback) => Quiz.findOne(
    {_id: new ObjectID(quizId)},
    {users: 1},
    callback
);

module.exports.removeUser = (userId, callback) => Quiz.findOneAndUpdate(
    {users: {$in: [String(userId)]}},
    {$pull: {
        users: String(userId)
    }},
    {new: true},
    callback
);

module.exports.removeUsers = (quizId, callback) => Quiz.findOneAndUpdate(
    {_id: new ObjectID(quizId)},
    {$set: {
        users: []
    }},
    {new: true},
    callback
);

module.exports.checkIfAnswerIsCorrect = (quizId, questionId, answerId, callback) => {
    Quiz.findOne(
        {_id: new ObjectID(quizId)},
        (err, quizData) => {

            if (err) {
                return callback(err);
            }

            return callback(
                err,
                quizData.questions[questionId]["answer_id"] === parseInt(answerId)
            );
        }
    );
};

module.exports.addUser = (quizId, userId, callback) => {
    Quiz.findOne(
        {_id: new ObjectID(quizId)},
        (err, result) => {
            if (err) {
                return callback(err);
            }

            if (result.users.length >= result.maxUsersCount) {
                return callback("Quiz is full");
            }

            Quiz.findOneAndUpdate(
                {_id: new ObjectID(quizId)},
                {$addToSet: {
                    users: userId
                }},
                {new: true},
                callback
            );
        }
    );
};

module.exports.isInProgress = (quizId, questionCounter = 0, callback) => {
    Quiz.findOne(
        {_id: new ObjectID(quizId)},
        (err, result) => {
            if (err) {
                return callback(false, true, err);
            }

            if (result.users.length < result.maxUsersCount) {
                return callback(false, true, result);
            }

            if (questionCounter >= result.questions.length) {
                return callback(false, false, result);
            }

            return callback(true, false, result);
        }
    );
};
