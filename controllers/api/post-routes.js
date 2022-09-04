const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get a list of all posts
router.get('/', (req, res) => {
    User.findAll({
        attributes: [
            'title',
            'id',
            'content', 
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['text', 'id', 'created_at', 'post_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(postsData => res.json(postsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;