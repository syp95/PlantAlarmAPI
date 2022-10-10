const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const secret = process.env.SECRET;

module.exports = {
    sign: (user) => {
        const payload = {
            id: user.id,
            role: user.username,
        };

        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
                role: decoded.role,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, secret, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },
    refreshVerify: async (token, userId) => {
        const getAsync = promisify(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(userId);
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};
