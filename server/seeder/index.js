const Quiz = require("../models/quiz");
const getCategories = require("./OpenTDB/api").getCategories;
const getQuestions = require("./OpenTDB/api").getQuestions;
const QUESTIONS_PER_QUIZ = require("./OpenTDB/config").QUESTIONS_PER_QUIZ;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function fetchQuizDataFromAPI() {
    return new Promise(resolve => {
        return getCategories().then(async categories => {
            const formattedQuizzes = [];

            await asyncForEach(categories, async category => {
                await getQuestions({
                    params: {
                        category: category.id,
                        amount: QUESTIONS_PER_QUIZ
                    }
                }).then(questions => {
                    const formattedQuestions = [];

                    questions.forEach(question => {
                        const allAnswers = question.incorrect_answers;
                        allAnswers.push(question.correct_answer);
                        const shuffledAnswers = allAnswers.sort(() => .5 - Math.random());

                        formattedQuestions.push({
                            name: question.question,
                            answers: shuffledAnswers,
                            answer_id: shuffledAnswers.indexOf(question.correct_answer)
                        });
                    });

                    formattedQuizzes.push({
                        name: category.name,
                        questions: formattedQuestions
                    });
                });
            });

            resolve(formattedQuizzes);
        })
    });
}

module.exports.init = () => {
    Quiz.getAll((err, quizzes) => {

        if (err) {
            console.log("SEEDER: Error");
            console.log(err);
            return;
        }

        if (quizzes.length > 0) {
            console.log(`SEEDER: No need to update`);
            return;
        }

        fetchQuizDataFromAPI().then(async quizData => {

            await quizData.forEach(quiz => Quiz.create({
                name: quiz.name,
                questions: quiz.questions
            }));

            console.log(`SEEDER: Added ${quizData.length} new quizzes`);
            console.log(`SEEDER: Done`);
            return;
        });
    })
};
