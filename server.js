const express = require('express');

const app = express();

const db = require('./models');

const { Plant } = db;

app.use(express.json());

app.get('/api/plants', async (req, res) => {
    const { creatorId } = req.query;
    if (creatorId) {
        const creators = await Plant.findAll({
            where: { creatorId },
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
    const plant = Plant.build(newPlant);
    await plant.save();
    res.send(plant);
});
