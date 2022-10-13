const { sign, verify, refreshVerify } = require('./jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    if (req.headers.authorization && req.cookies.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.cookies.refresh;

        const authResult = verify(authToken);

        const decoded = jwt.decode(authToken, { complete: true });

        if (decoded === null) {
            res.status(401).send({
                ok: false,
                message: 'No authorized!',
            });
        }

        const userid = decoded.payload.id;

        const refreshResult = refreshVerify(refreshToken, userid);

        if (authResult.ok === false && authResult.message === 'jwt expired') {
            if (refreshResult.ok === false) {
                res.status(401).send({
                    ok: false,
                    message: 'No authorized!',
                });
            } else {
                const newAccessToken = sign(user);
                res.cookie('refresh', refresh, { httpOnly: true });
                res.status(200).send({
                    ok: true,
                    logindata: {
                        accessToken: newAccessToken,
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
