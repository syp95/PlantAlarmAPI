const router = require('express').Router();

const multer = require('multer');
const authJWT = require('../middlewares/jwt-auth');
const path = require('path');
const db = require('../models');

const { Plant } = db;

router.get('/', async (req, res) => {
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

router.get('/:id', authJWT, async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findAll({
        where: { creatorId: id },
        order: [['createdAt', 'DESC']],
    });
    if (plant) {
        res.send(plant);
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

router.post('/', async (req, res) => {
    const newPlant = req.body;

    const plant = await Plant.create(newPlant);
    res.send(plant);
});

const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads/img/',
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(
                null,
                path.basename(file.originalname, ext) + Date.now() + ext,
            );
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/images', upload.single('image'), async (req, res) => {
    console.log(req.file);
    res.send({ fileName: req.file.filename });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const result = await Plant.update(newInfo, { where: { id } });
    if (result[0]) {
        res.send({ message: `${result[0]} row(s) affected` });
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await Plant.destroy({ where: { id } });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row deleted` });
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

module.exports = router;
