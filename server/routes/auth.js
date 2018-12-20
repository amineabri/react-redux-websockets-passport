const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("../passport");
const secretToken = require("../config").JWT_SECRET;
const jwtTokenExpiration = require("../config").JWT_TOKEN_EXPIRATION;

router.post("/signup", (req, res) => {
    const { name, password } = req.body;

    if (name.length <= 3) {
        res.status(400);
        return res.json({ error: 'Username should be minimum 4 characters'});
    }

    if (password.length <= 3) {
        res.status(400);
        return res.json({ error: 'Password should be minimum 4 characters'});
    }

    User.findOne({ name: name }, (err, user) => {

        if (err) {
            return next(err);
        }

        if (user) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const newUser = new User({
            name: name,
            password: password
        });

        newUser.save((err, savedUser) => {

            if (err) {
                return res.json(err);
            }

            res.json({ name: savedUser.name });
        });
    });
});

router.post("/login", (req, res, next) => {
        const { name, password } = req.body;

        if (name.length <= 3) {
            res.status(400);
            return res.json({ error: 'Username should be minimum 4 characters'});
        }

        if (password.length <= 3) {
            res.status(400);
            return res.json({ error: 'Password should be minimum 4 characters'});
        }

        next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {

            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({
                    error: info.message
                });
            }

            req.logIn(user, () => {
                jwt.sign(
                    { sub: user._id },
                    secretToken,
                    { expiresIn: jwtTokenExpiration },
                    (err, token) => {
                        res.status(200).json({
                            token: `Bearer ${token}`
                        });
                    }
                );
            })
        })(req, res, next);
    }
);

router.get("/user", (req, res, next) => {

    if (req.user) {
        return res.json({
            isAuthenticated: true,
            name: req.user.name
        });
    }

    res.json({
        isAuthenticated: false,
        name: null
    });
});

router.post("/logout", (req, res) => {
    if (!req.user) {
        return res.status(401);
    }

    req.session.destroy(() => {
        res.json({ isAuthenticated: false });
    });
});

module.exports = router;
