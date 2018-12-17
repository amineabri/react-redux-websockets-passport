import * as actionTypes from "../actionTypes";
import { Record } from "immutable";

const Model = Record({
    data: []
});

const initialState = Model();

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_LEADERBOARD:
        return state.withMutations(mutant => {
            mutant.set("data", action.payload.data);
        });
        default:
        return state;
    }
};

export default UserReducer;
