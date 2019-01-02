import * as actionTypes from "../actionTypes";
import { Record } from "immutable";

const Model = Record({
    isAuthenticated: false,
    name: null
});

const initialState = Model();

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CURRENT_USER.FULFILLED:
            return state.withMutations(mutant => {
                mutant.set("isAuthenticated", action.payload.isAuthenticated);
                mutant.set("name", action.payload.name);
            });
        default:
            return state;
    }
};

export default UserReducer;
