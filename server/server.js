const SocketServer = require("ws").Server;
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dbConnection = require("./models");
const passport = require("./passport");
const seeder = require("./seeder");
const WebsocketService = require("./services/WebsocketService");
const authRoutes = require("./routes/auth");
const quizzesRoutes = require("./routes/quizzes");
const PORT = require("./config").PORT;
const SESSION_SECRET = require("./config").SESSION_SECRET;

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(
    session({
        secret: SESSION_SECRET,
        store: new MongoStore({ mongooseConnection: dbConnection }),
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

seeder.init();

app.use("/auth", authRoutes);
app.use("/quizzes", quizzesRoutes);

const server = app.listen(PORT, () => {
    console.log(`EXPRESS: Listening on PORT: ${PORT}`);
});

const wss = new SocketServer({ server });

new WebsocketService(wss);
