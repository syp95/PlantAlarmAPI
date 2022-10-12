const express = require('express');
const app = express();
const cors = require('cors');

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

app.use(cors());

const auth = require('./api/auth.js');
app.use('/api/auth', auth);

const plant = require('./api/plant.js');
app.use('/api/plants', plant);

app.listen(3001, () => {
    console.log('Server on');
});
