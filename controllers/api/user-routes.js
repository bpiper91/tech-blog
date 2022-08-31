const router = require('express').Router();
const { User, Post } = require('../../models');

// create a user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(userCreds => {
        req.session.save(() => {
            req.session.user_id = userCreds.id;
            req.session.username = userCreds.username;
            req.session.loggedIn = true;

            res.json(userCreds);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;