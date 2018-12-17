export const getAllQuizzes = store => store.quizzes.get('allQuizzes').toJS();
export const getQuizError = store => store.quizzes.get('error');
export const getWaitForUsersCount = store => store.quizzes.get('waitForUsersCount');
export const getQuizIsInProgress = store => store.quizzes.get('isInProgress');
export const getQuizIsFinished = store => store.quizzes.get('isFinished');
export const getQuizIsUnexpectedFinished = store => store.quizzes.get('isUnexpectedFinished');
export const getQuizName = store => store.quizzes.getIn(['activeQuiz', 'name']);
export const getIsAuthenticated = store => store.user.get('isAuthenticated');
export const getActiveQuestion = store => store.quizzes.get('activeQuestion');
export const getActiveUsers = store => store.quizzes.get('activeUsers');
export const getLeaderboard = store => store.leaderboard.get('data');
export const getUsersOnline = store => store.quizzes.get('usersOnline');
export const getCurrentUserName = store => store.user.get('name');

export default {
    getAllQuizzes,
    getQuizError,
    getWaitForUsersCount,
    getQuizIsInProgress,
    getQuizName,
    getIsAuthenticated,
    getQuizIsFinished,
    getActiveQuestion,
    getActiveUsers,
    getLeaderboard,
    getUsersOnline,
    getQuizIsUnexpectedFinished,
    getCurrentUserName
}
