const router = require('express').Router();

const db = require('../models');

const { User } = db;

const jwt = require('jsonwebtoken');
const SECRET = 'SECRET';

router.get('/id', async (req, res) => {
    const id = await User.findAll();
    res.send(id);
});

router.post('/login', async (req, res) => {
    const { userid, userpassword, username } = req.body;
    const userCount = await User.count({ where: { userid, userpassword } });

    if (userCount === 1) {
        const token = jwt.sign(
            {
                username,
            },
            SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '10m',
            },
        );
        res.status(200).json({ status: true, token });
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
