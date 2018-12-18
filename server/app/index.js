const User = require('../models/user');
const Quiz = require('../models/quiz');
const messages = require("../constants/messages");

module.exports.answerQuestion = (
    userId,
    quizId,
    questionId,
    answerId,
    callback
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
                        payload: quiz.maxUsersCount - quiz.users.length
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

module.exports.finishQuiz = (quizId, isUnexpectedFinished = false, callback) => {
    return Quiz.getById(
        quizId,
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

        Quiz.removeUsers(
            quizId,
            (err, result) => {
                quizData.users.forEach((userId) => {
                    User.calculateTotalPoints(
                        userId,
                        () => User.reset(
                            userId,
                            err => {

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
                                            usersCount: result.users.length
                                        }
                                    }
                                );
                            }
                        )
                    );
                })
            }
        );

        User.getByActiveQuizId(
            quizId,
            (err, activeUsers) => {
                callback(
                    {
                        type: messages.FINISH_QUIZ_SUCCESS,
                        payload: {
                            quizId: quizData._id,
                            activeUsers: activeUsers,
                            isUnexpectedFinished
                        }
                    },
                    quizData.users
                );
            }
        );
    });
};

module.exports.sendQuestions = (quizId, callback) => {
    let questionCounter = 0;

    const questionAsk = () => {

        Quiz.isInProgress(quizId, questionCounter)
            .then(quizData => {
                User.getByActiveQuizId(
                    quizId,
                    (err, activeUsers) => {
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
                    }
                );
            })
            .catch(isUnexpectedFinished => {
                clearInterval(interval);

                return this.finishQuiz(quizId, isUnexpectedFinished, callback);
            }
        );
    };

    questionAsk();

    const interval = setInterval(questionAsk, 10000);
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

                    return this.sendQuestions(quizId, callback);
                }
            );
        }
    );
};
