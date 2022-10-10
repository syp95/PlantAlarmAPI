const router = require('express').Router();

const db = require('../models');

const { User } = db;

const jwt = require('../middlewares/jwt-util');
const authJWT = require('../middlewares/jwt-auth');
const redisClient = require('../middlewares/redis');
const refresh = require('../middlewares/jwt-refresh');

router.get('/id/:id', authJWT, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { userid: id } });
    if (user) {
        res.send(user);
    } else {
        res.status(401).json({ status: false, result: 'no ID' });
    }
});

router.post('/login', async (req, res) => {
    const { userid, userpassword } = req.body;
    const userCount = await User.count({
        where: { userid, userpassword },
    });

    if (userCount === 1) {
        const { username } = await User.findOne({
            where: { userid },
        });

        const accessToken = jwt.sign({ userid, username });
        const refreshToken = jwt.refresh();

        redisClient.set(userid, refreshToken);

        res.status(200).json({
            status: true,
            logindata: { accessToken, refreshToken, userid },
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

router.post('/refresh', refresh);

module.exports = router;
