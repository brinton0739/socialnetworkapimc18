const { User } = require('../../model')
const router = require('express').Router();


router.get('/', async (req, res) => {
    const users = await User.find().populate({ path: "friends", model: User });
    if (!users) {
        res.status(200).json('[]');
    }
    res.status(200).json(users);
});

router.get('/:user_id', async (req, res) => {
    const user = await User.findById(req.params.user_id);
    if (!user) {
        res.status(404).end();
    }
    await user.populate({ path: "friends", model: User });
    res.status(200).json(user);
});

router.post('/', async (req, res) => {
    await User.create(req.body, (err, doc) => {
        if (err) {
            res.status(500).json(`user not created err: ${err}`);
            return;
        }
        return User.findById(doc._id).populate({path: "friends", model: User}).exec((err, doc) => {
            if (err) {
                res.status(500).json(`user not created err: ${err}`);
                return
            }
            res.status(200).json(doc);
            return;
        })
    });
});

router.put('/:user_id', (req, res) => {
    const user = User.findByIdAndUpdate(req.params.user_id, req.body, {new: true}, async (err, doc) => {
        if (err) {
            res.status(500).json(err);
        } else if (!doc.id) {
            res.status(404).end()
        } else {
            await doc.populate({path: 'friends', model: User});
            res.status(200).json(doc);
        }
    });
});

router.delete('/:user_id', (req, res) => {
    User.findById(req.params.user_id, (err, doc) => {
        if (err) {
            res.status(500).json(err);
        } else {
            User.findOneAndDelete({username: doc.username}, (err, doc) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(204).end();
                }
            });
        }
    });
});

router.post('/:user_id/friends/:friend_id', (req, res) => {
    User.findById(req.params.user_id, (err, doc) => {
        if (err) {
            res.status(500).json(err);
        } else if (!doc.id) {
            res.status(404).end();
        } else {
            doc.friends.push(req.params.friend_id)
            User.findByIdAndUpdate(req.params.user_id, doc, {new: true}, (err, doc) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(doc);
                }
            });
        }
    });
});

router.delete('/:user_id/friends/:friend_id', (req, res) => {
    User.findById(req.params.user_id, (err, doc) => {
        if (err) {
            res.status(500).json(err);
        } else if (!doc.id) {
            res.status(404).end();
        } else {
            doc.friends = doc.friends.filter((id) => {
                return id.toString() !== req.params.friend_id;
            });
            console.log(doc.friends);
            User.findByIdAndUpdate(req.params.user_id, doc, {new: true}, (err, doc) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(doc);
                }
            });
        }
    });
});

module.exports = router;