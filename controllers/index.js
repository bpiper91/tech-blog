const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// if not one of above routes, send 404 error
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;