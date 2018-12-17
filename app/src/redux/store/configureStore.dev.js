import thunk from "redux-thunk";
import promise from "redux-promise";
import { webSocketMiddleware } from "../../services/WebSocketService";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "../reducers";

const middleware = [thunk, promise, webSocketMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middleware))
);

export default store;
