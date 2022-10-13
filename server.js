const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(
    express.json({
        limit: '50mb',
    }),
);

app.use(
    express.urlencoded({
        limit: '50mb',
        extended: false,
    }),
);

app.use(cookieParser());

const corsOption = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOption));

const auth = require('./api/auth.js');
app.use('/api/auth', auth);

const plant = require('./api/plant.js');
app.use('/api/plants', plant);

app.listen(3001, () => {
    console.log('Server on');
});
