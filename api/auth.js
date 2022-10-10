const router = require('express').Router();

const db = require('../models');

const { User } = db;
const { verifyToken } = require('../middlewares/jwt-util');
const jwt = require('../middlewares/jwt-util');
const redisClient = require('../middlewares/redis');

require('dotenv').config();

router.get('/id/:id', verifyToken, async (req, res) => {
    const userid = param.id;
    const user = await User.findOne({ where: { userid } });
    if (user) {
        res.send(user);
    } else {
        res.status(401).json({ status: false, result: 'no ID' });
    }
});

router.post('/login', async (req, res) => {
    const { userid, userpassword, username } = req.body;
    const userCount = await User.count({
        where: { userid, userpassword },
    });

    if (userCount === 1) {
        const accessToken = jwt.sign({ userid, username });
        const refreshToken = jwt.refresh();

        redisClient.set(userid, refreshToken);

        res.status(200).json({
            status: true,
            data: { accessToken, refreshToken, userid },
        });
    } else {
        res.status(401).json({ status: false, result: 'login fail' });
    }
});

router.post('/register', async (req, res) => {
    const { userid, userpassword, username } = req.body;
    const userCount = await User.count({ where: { userid, userpassword } });

    if (userCount > 0) {
        res.status(401).json({
            status: false,
            result: 'username already exist',
        });
    } else {
        User.create({
            userid,
            userpassword,
            username,
        });
        res.status(200).json({ status: true, result: 'register success' });
    }
});

module.exports = router;
