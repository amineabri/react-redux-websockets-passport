const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("../passport");
const secretToken = require("../config").JWT_SECRET;
const jwtTokenExpiration = require("../config").JWT_TOKEN_EXPIRATION;

const validateLoginData = require("../validation/login");
const validateRegisterData = require("../validation/register");

router.post("/signup", (req, res) => {
    const { errors, isValid } = validateRegisterData(req.body);

    if (!isValid) {
        return res.status(400).json({ errors });
    }

    const { name, password } = req.body;

    User.findOne({ name: name }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.status(400).json({
                errors: {
                    name: "User already exists"
                }
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

router.post(
    "/login",
    (req, res, next) => {
        const { errors, isValid } = validateLoginData(req.body);

        if (!isValid) {
            return res.status(400).json({ errors });
        }

        next();
    },
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({
                    errors: info
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
            });
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
