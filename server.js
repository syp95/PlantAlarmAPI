const express = require('express');

const app = express();

const db = require('./models');

const { Plant } = db;

app.use(express.json());

app.get('/api/plants', async (req, res) => {
    const { creator } = req.query;
    if (creator) {
        const creators = await Plant.findAll({
            where: { creatorId: creator },
            order: [['createdAt', 'DESC']],
        });
        res.send(creators);
    }
    const plants = await Plant.findAll();
    res.send(plants);
});

app.listen(3000, () => {
    console.log('Server on');
});

app.get('/api/plants/:id', async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findOne({ where: { id } });
    if (plant) {
        res.send(plant);
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

app.post('/api/plants', async (req, res) => {
    const newPlant = req.body;
    const plant = await Plant.create(newPlant);
    res.send(plant);
});

app.put('/api/plants/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const result = await Plant.update(newInfo, { where: { id } });
    if (result[0]) {
        res.send({ message: `${result[0]} row(s) affected` });
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

app.delete('/api/plants/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await Plant.destroy({ where: { id } });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row deleted` });
    } else {
        res.status(404).send({ message: 'no id' });
    }
});
