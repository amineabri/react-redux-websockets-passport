const { OrderedMap, Set, Record } = require("immutable");
const jwt = require("jsonwebtoken");
const App = require("../app");
const ObjectID = require("mongodb").ObjectID;
const secretToken = require("../config").JWT_SECRET;
const messages = require("../constants/messages");

const MessageRecord = Record({
    type: null,
    payload: {},
    token: null
});

const ConnectionRecord = Record({
    ws: null,
    userId: null,
    socketId: null
});

class WebsocketService {
    constructor(wss) {
        this.wss = wss;
        this.connections = OrderedMap();

        this.sendToUsers = this.sendToUsers.bind(this);

        this.initWebSocketServer();
    }

    initWebSocketServer() {
        return this.wss.on("connection", ws =>
            this.onConnectionOpen(ws, new ObjectID().toString())
        );
    }

    onConnectionOpen(ws, socketId) {
        const connection = this.createConnection(socketId, ws);

        ws.on("message", message =>
            this.onMessageReceived(connection, message)
        );
        ws.on("close", () => this.onConnectionClose(connection));

        console.log(
            `WEB_SOCKET_SERVICE: ${connection.get("socketId")} Connected`
        );
        return connection;
    }

    createConnection(socketId, ws) {
        return this.setConnection(
            new ConnectionRecord({
                ws,
                socketId
            })
        );
    }

    onMessageReceived(userConnection, message) {
        const decodedMessage = this.decodeMessage(message);

        return this.authenticateConnection(
            userConnection,
            decodedMessage.get("token")
        )
            .then(authenticatedConnection =>
                this.parseMessage(authenticatedConnection, decodedMessage)
            )
            .catch(error => {
                console.log(
                    `WEB_SOCKET_SERVICE: Error when authenticating - ${error}`
                );
                this.send(userConnection.get("ws"), {
                    type: messages.JWT_AUTHENTICATION_ERROR,
                    payload: error
                });
            });
    }

    onConnectionClose(userConnection) {
        return this.removeConnection(userConnection);
    }

    authenticateConnection(userConnection, bearerToken) {
        return new Promise((resolve, reject) => {
            if (!bearerToken) {
                return reject("Token not provided");
            }

            const token = bearerToken.split(" ");

            if (token.length !== 2 || token[0] !== "Bearer") {
                return reject("Token not formatted correctly");
            }

            jwt.verify(token[1], secretToken, (err, decoded) => {
                if (err) {
                    return reject(err.message);
                }

                const authenticatedConnection = this.connections
                    .get(userConnection.get("socketId"))
                    .update("userId", () => decoded.sub);

                this.setConnection(authenticatedConnection);

                return resolve(authenticatedConnection);
            });
        });
    }

    removeConnection(userConnection) {
        this.connections = this.connections.remove(
            userConnection.get("socketId")
        );

        console.log(
            `WEB_SOCKET_SERVICE: ${userConnection.get("socketId")} Disconnected`
        );
        return userConnection;
    }

    setConnection(userConnection) {
        this.connections = this.connections.set(
            userConnection.get("socketId"),
            userConnection
        );

        return userConnection;
    }

    decodeMessage(message) {
        try {
            JSON.parse(message);
        } catch (err) {
            console.log("WEB_SOCKET_SERVICE: Error parsing message:", err);
            return err;
        }

        return new MessageRecord(JSON.parse(message));
    }

    parseMessage(userConnection, message) {
        const type = message.get("type");
        const payload = message.get("payload");

        console.log(
            `WEB_SOCKET_SERVICE: Message from ${userConnection.get(
                "socketId"
            )} : ${type}`
        );

        switch (type) {
            case messages.LEAVE_QUIZ_REQUEST:
                return App.leaveQuiz(
                    userConnection.get("userId"),
                    this.sendToUsers
                );

            case messages.ANSWER_QUESTION_REQUEST:
                return App.answerQuestion(
                    userConnection.get("userId"),
                    payload.quizId,
                    payload.questionId,
                    payload.answerId,
                    this.sendToUsers
                );

            case messages.JOIN_QUIZ_REQUEST:
                return App.joinQuiz(
                    userConnection.get("userId"),
                    payload.quizId,
                    this.sendToUsers
                );

            default:
                break;
        }
    }

    send(ws, obj) {
        if (ws.readyState !== 1) {
            return;
        }

        return ws.send(JSON.stringify(obj));
    }

    getConnectedUsers() {
        return this.connections
            .filter(connection => connection.userId !== null)
            .map(connection => connection.userId)
            .toArray();
    }

    sendToUsers(message, users = this.getConnectedUsers()) {
        return this.connections
            .filter(value => new Set(users).has(value.userId))
            .forEach(connection => this.send(connection.ws, message));
    }
}

module.exports = WebsocketService;
