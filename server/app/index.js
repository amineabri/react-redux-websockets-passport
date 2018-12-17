const ObjectID = require('mongodb').ObjectID;
const User = require('../models/user');
const Quiz = require('../models/quiz');
const messages = require("../constants/messages");

module.exports.answerQuestion = (
    userId,
    quizId,
    questionId,
    answerId,
    callback = () => {}
) => {
    Quiz.getById(quizId, (err, quiz) => {
        if (err) {
            return err;
        }

        const isCorrect = quiz.questions[questionId]["answer_id"] === parseInt(answerId);

        if (isCorrect) {
            User.incrementPoint(userId, err => {
                if (err) {
                    return err;
                }
            });
        }

        return callback(
            {
                type: messages.ANSWER_QUESTION_SUCCESS,
                payload: {
                    answerId,
                    isCorrect
                }
            },
            [userId]
        );
    });
};

module.exports.leaveQuiz = (userId, callback) => {
    Quiz.removeUser(userId, (err, quizData) => {
        if (err) {
            return;
        }

        if (!quizData) {
            return;
        }

        User.reset(userId, err => {

            if (err) {
                return;
            }

            // Inform current quiz users to wait
            Quiz.getUsers(quizData._id, (err, quiz) => {

                if (err) {
                    return;
                }

                return callback(
                    {
                        type: messages.JOIN_QUIZ_WAIT,
                        payload: quizData.maxUsersCount - quizData.users.length
                    },
                    quiz.users
                );
            })

            // Inform other users that a user left the quiz
            return callback(
                {
                    type: messages.SOMEONE_LEFT_QUIZ,
                    payload: {
                        quizId: quizData._id,
                        usersCount: quizData.users.length
                    }
                }
            );
        });
    });
};

module.exports.joinQuiz = (userId, quizId, callback) => {
    Quiz.addUser(
        quizId,
        userId,
        (err, quizData) => {

            if (err) {
                return callback(
                    {
                        type: messages.JOIN_QUIZ_REJECT,
                        payload: err
                    },
                    [userId]
                );
            }

            User.joinQuiz(
                userId,
                quizId,
                err => {

                    if (err) {
                        return callback(
                            {
                                type: messages.JOIN_QUIZ_REJECT,
                                payload: err
                            },
                            [userId]
                        );
                    }

                    callback(
                        {
                            type: messages.JOIN_QUIZ_INFO,
                            payload: {
                                id: quizId,
                                name: quizData.name
                            }
                        },
                        [userId]
                    );

                    // Inform other users that user joined quiz
                    callback({
                        type: messages.SOMEONE_JOINED_QUIZ,
                        payload: {
                            quizId: quizId,
                            usersCount: quizData.users.length
                        }
                    });

                    // Wait for other players to join if necessary
                    if (quizData.users.length < quizData.maxUsersCount) {
                        return callback(
                            {
                                type: messages.JOIN_QUIZ_WAIT,
                                payload: quizData.maxUsersCount - quizData.users.length
                            },
                            quizData.users
                        );
                    }

                    callback(
                        {
                            type: messages.START_QUIZ_SUCCESS
                        },
                        quizData.users
                    );

                    let questionCounter = 0;

                    const questionAsk = () => {

                        User.find(
                            {activeQuizId: quizId},
                            {"name": true, "points": true},
                            (err, activeUsers) => {

                            if (err) {
                                return callback(
                                    {
                                        type: messages.JOIN_QUIZ_REJECT,
                                        payload: err
                                    },
                                    quizData.users
                                );
                            }

                            // Finish quiz if there is less than 2 activeUsers
                            if (activeUsers.length < 2) {
                                clearInterval(interval);

                                return Quiz.findOne(
                                    {_id: new ObjectID(quizId)},
                                    (err, quizData) => {

                                    if (err) {
                                        return callback(
                                            {
                                                type: messages.JOIN_QUIZ_REJECT,
                                                payload: err
                                            },
                                            quizData.users
                                        );
                                    }

                                    // Remove users from quiz and assign points
                                    quizData.users.forEach((userId) => {
                                        Quiz.findOneAndUpdate(
                                            { _id: new ObjectID(quizId) },
                                            { $pull: { users: String(userId) } },
                                            { new: true },
                                            (err, quizData) => {

                                                if (err) {
                                                    return callback(
                                                        {
                                                            type: messages.JOIN_QUIZ_REJECT,
                                                            payload: err
                                                        },
                                                        quizData.users
                                                    );
                                                }

                                                User.findOne(
                                                    {_id: new ObjectID(userId)},
                                                    (err, user) => {

                                                        if (err) {
                                                            return callback(
                                                                {
                                                                    type: messages.JOIN_QUIZ_REJECT,
                                                                    payload: err
                                                                },
                                                                quizData.users
                                                            );
                                                        }

                                                    User.findOneAndUpdate(
                                                        {_id: new ObjectID(userId)},
                                                        {$set: {
                                                            activeQuizId: null,
                                                            points: 0,
                                                            total_points: user.total_points + user.points
                                                        }},
                                                        (err) => {
                                                            if (err) {
                                                                return callback(
                                                                    {
                                                                        type: messages.JOIN_QUIZ_REJECT,
                                                                        payload: err
                                                                    },
                                                                    quizData.users
                                                                );
                                                            }
                                                        }
                                                    );
                                                });
                                            }
                                        );
                                    });

                                    return callback(
                                        {
                                            type: messages.FINISH_QUIZ_SUCCESS,
                                            payload: {
                                                quizId: quizId,
                                                activeUsers: activeUsers,
                                                isUnexpectedFinished: true
                                            }
                                        },
                                        quizData.users
                                    );

                                });
                            }

                            // Finish the quiz if it is the last question
                            if (questionCounter >= quizData.questions.length) {
                                clearInterval(interval);

                                return Quiz.findOne(
                                    {_id: new ObjectID(quizId)},
                                    (err, quizData) => {

                                    if (err) {
                                        return callback(
                                            {
                                                type: messages.JOIN_QUIZ_REJECT,
                                                payload: err
                                            },
                                            [userId]
                                        );
                                    }

                                    // Remove users from quiz and assign points
                                    quizData.users.forEach((userId) => {
                                        Quiz.findOneAndUpdate(
                                            {_id: new ObjectID(quizId)},
                                            {$pull: { users: String(userId) }},
                                            {new: true},
                                            (err, quizData) => {

                                                if (err) {
                                                    return callback(
                                                        {
                                                            type: messages.JOIN_QUIZ_REJECT,
                                                            payload: err
                                                        },
                                                        quizData.users
                                                    );
                                                }

                                                User.findOne(
                                                    {_id: new ObjectID(userId)},
                                                    (err, user) => {

                                                        if (err) {
                                                            return callback(
                                                                {
                                                                    type: messages.JOIN_QUIZ_REJECT,
                                                                    payload: err
                                                                },
                                                                quizData.users
                                                            );
                                                        }

                                                        User.findOneAndUpdate(
                                                            {_id: new ObjectID(userId)},
                                                            {$set: {
                                                                activeQuizId: null,
                                                                points: 0,
                                                                total_points: user.total_points + user.points
                                                            }},
                                                            (err) => {

                                                                if (err) {
                                                                    return callback(
                                                                        {
                                                                            type: messages.JOIN_QUIZ_REJECT,
                                                                            payload: err
                                                                        },
                                                                        quizData.users
                                                                    );
                                                                }

                                                                callback(
                                                                    {
                                                                        type: messages.SOMEONE_LEFT_QUIZ,
                                                                        payload: {
                                                                            quizId: quizId,
                                                                            usersCount: quizData.users.length
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    });

                                    callback(
                                        {
                                            type: messages.FINISH_QUIZ_SUCCESS,
                                            payload: {
                                                quizId: quiz._id,
                                                activeUsers: activeUsers
                                            }
                                        },
                                        quizData.users
                                    );
                                });
                            }

                            callback(
                                {
                                    type: messages.INCOMING_QUESTION,
                                    payload: {
                                        quizId: quizId,
                                        questionId: questionCounter,
                                        question: quizData.questions[questionCounter],
                                        activeUsers: activeUsers
                                    }
                                },
                                quizData.users
                            );

                            questionCounter++;
                        });
                    };

                // Ask the first question
                questionAsk();

                // Ask other questions after interval has passed
                const interval = setInterval(questionAsk, 10000);
            }
        );
    });
};
