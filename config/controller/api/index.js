const User = require('./user');
const Thought = require('./thought');

const router = require('express').Router();

router.use('/users', User);
router.use('/thoughts', Thought)

module.exports = router;