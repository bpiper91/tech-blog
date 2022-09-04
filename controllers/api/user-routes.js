const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get a list of all users and their ids
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] },
    })
    .then(usersData => res.json(usersData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// get a single user's data by their id
router.get('/:id', (req, res) => {
    User.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: [ 'title', 'id', 'created_at' ]
            },
            {
                model: Comment,
                attributes: [ 'text', 'id', 'created_at'],
                include: {
                    model: Post,
                    attributes: [ 'title', 'id' ]
                }
            }
        ],
    })
    .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        };
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

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

// authenticate a user
router.post('/login', (req, res) => {
    // expects req.body == {username: 'bpiper', password: 'password123'}
    User.findOne({
        where: { username: req.body.username },
    })
    .then(userData => {
        // see if user exists, and throw error if it doesn't
        if (!userData) {
            res.status(400).json({ message: 'Username not found'});
            return;
        };

        // verify user password
        const validPassword = userData.authenticate(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        };

        req.session.save(() => {
            // declare session data
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
        });

        res.json({ user: userData, message: 'You are now logged in' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;