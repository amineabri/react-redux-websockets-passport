const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

const strategy = new LocalStrategy(
    {
        usernameField: "name"
    },
    function(name, password, done) {
        User.findOne({ name: name }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { name: "User does not exist" });
            }
            if (!user.checkPassword(password)) {
                return done(null, false, { password: "Incorrect password" });
            }
            return done(null, user);
        });
    }
);

module.exports = strategy;
