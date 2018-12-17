import * as actionTypes from "./actionTypes";

import ApplicationService from '../services/ApplicationService';

export const getAllQuizzes = () => ({
    type: actionTypes.GET_ALL_QUIZZES,
    payload: ApplicationService.getAllQuizzes()
});

export const joinQuizRequest = (quizId) => ({
    type: actionTypes.JOIN_QUIZ_REQUEST,
    payload: { quizId },
    webSocketAction: true
});

export const leaveQuizRequest = (quizId) => ({
    type: actionTypes.LEAVE_QUIZ_REQUEST,
    payload: { quizId },
    webSocketAction: true
});

export const setCurrentUser = (payload) => ({
    type: actionTypes.SET_CURRENT_USER,
    payload: payload
});

export const logoutRequest = () => ({
    type: actionTypes.LOGOUT_REQUEST,
    payload: ApplicationService.logout()
});

export const answerQuestionRequest = (params) => ({
    type: actionTypes.ANSWER_QUESTION_REQUEST,
    payload: params,
    webSocketAction: true
});

export const getLeaderboard = () => ({
    type: actionTypes.GET_LEADERBOARD,
    payload: ApplicationService.getLeaderboard()
});

export default {
    getAllQuizzes,
    joinQuizRequest,
    leaveQuizRequest,
    logoutRequest,
    answerQuestionRequest,
    getLeaderboard,
    setCurrentUser
};