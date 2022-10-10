const { sign, verify, refreshVerify } = require('./jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);

        const decoded = jwt.decode(authToken);

        if (decoded === null) {
            res.status(401).send({
                ok: false,
                message: 'No authorized!',
            });
        }

        const refreshResult = refreshVerify(refreshToken, decoded.id);

        if (authResult.ok === false && authResult.message === 'jwt expired') {
            if (refreshResult.ok === false) {
                res.status(401).send({
                    ok: false,
                    message: 'No authorized!',
                });
            } else {
                const newAccessToken = sign(user);

                res.status(200).send({
                    ok: true,
                    data: {
                        accessToken: newAccessToken,
                        refreshToken,
                    },
                });
            }
        } else {
            res.status(400).send({
                ok: false,
                message: 'Acess token is not expired!',
            });
        }
    } else {
        res.status(400).send({
            ok: false,
            message: 'Access token and refresh token are need for refresh!',
        });
    }
};

module.exports = refresh;
