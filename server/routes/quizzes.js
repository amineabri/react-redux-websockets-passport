const express = require("express");
const User = require("../models/user");
const Quiz = require("../models/quiz");
const router = express.Router();

router.get("/stats", (req, res, next) => {
    if (!req.user) {
        return res.status(401);
    }

    User.aggregate(
        [
            {
                $project: {
                    name: true,
                    total_points: true,
                    _id: false
                }
            },
            {
                $sort: { total_points: -1 }
            }
        ],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
            }
            res.json(results);
        }
    );
});

router.get("/", (req, res, next) => {
    if (!req.user) {
        return res.status(401);
    }

    Quiz.aggregate(
        [
            {
                $project: {
                    name: true,
                    usersCount: { $size: "$users" },
                    maxUsersCount: true
                }
            },
            {
                $sort: { name: 1 }
            }
        ],
        (err, quizzes) => {
            res.json(quizzes);
        }
    );
});

module.exports = router;
