const router = require('express').Router();

const multer = require('multer');
const { verifyToken } = require('../middlewares');

const db = require('../models');

const { Plant } = db;

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
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

router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findOne.findAll({
        where: { creatorId: id },
        order: [['createdAt', 'DESC']],
    });
    if (plant) {
        res.send(plant);
    } else {
        res.status(404).send({ message: 'no id' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const newPlant = req.body;
    const image = req.file;
    if (image) {
        newPlant.imageUrl = image.path;
    } else {
        newPlant.imageUrl = 'defaultImage';
    }
    const plant = await Plant.create(newPlant);
    res.send(plant);
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
