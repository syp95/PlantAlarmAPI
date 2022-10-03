const express = require('express');
const app = express();

app.use(express.json());

const auth = require('./api/auth.js');
app.use('/api/auth', auth);

const plant = require('./api/plant.js');
app.use('/api/plants', plant);

app.listen(3000, () => {
    console.log('Server on');
});
