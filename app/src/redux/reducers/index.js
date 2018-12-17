import { combineReducers } from "redux";
import user from "./user";
import quizzes from "./quizzes";
import leaderboard from "./leaderboard";

export default combineReducers({
    user,
    quizzes,
    leaderboard
});
