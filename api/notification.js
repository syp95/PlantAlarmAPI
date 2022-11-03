const router = require('express').Router();
const { scheduleJob } = require('node-schedule');
const webpush = require('web-push');
const db = require('../models');

const { Notification } = db;
const webPush = require('web-push');

require('dotenv').config();
const SUBJECT = `mailto:${process.env.WEB_PUSH_EMAIL}`;
const vapidKeys = webPush.generateVAPIDKeys();
const VAPID_PUBLIC = vapidKeys.publicKey;
const VAPID_PRIVATE = vapidKeys.privateKey;

webPush.setVapidDetails(SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

router.get('/vapid', (req, res) => {
    res.send(VAPID_PUBLIC);
});

router.get('/subscription', async (req, res) => {
    const subscription = await Notification.findAll();

    res.status(200).send(subscription);
});

router.get('/subscription/:id', async (req, res) => {
    const { id } = req.params;
    const subscription = await Notification.findOne({ where: { userid: id } });
    if (subscription) {
        res.status(200).send(subscription);
    } else {
        res.status(401);
    }
});

router.post('/subscription', async (req, res) => {
    const { userid, subscription } = req.body;
    const subCount = await Notification.count({ where: { userid } });

    if (subCount > 0) {
        res.status(401).json({
            status: false,
            result: 'subscription already exist',
        });
    } else {
        Notification.create({
            userid,
            subscription,
        });
        res.status(200).json({ status: true, result: 'register success' });
    }
});

router.delete('/subscription/:userid', async (req, res) => {
    const { userid } = req.params;
    const deletedCount = await Notification.destroy({ where: { userid } });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row deleted` });
    } else {
        res.status(404).send({ message: 'no userid' });
    }
});

router.post('/send-push-notification', async (req, res) => {
    const { targetId: targetUserId, message, date } = req.body ?? {};

    const targetUser = await Notification.findOne({
        where: { userid: targetUserId },
    });
    console.log(req.body);
    if (targetUser) {
        const messageData = {
            title: '식물 알람 | Plant Alarm',
            message,
        };
        const alarmDate = date; // 날짜로 변환해주기

        // scheduleJob(alarmDate, () => {});
        webpush
            .sendNotification(
                targetUser.subscription,
                JSON.stringify(messageData),
                { TTL: 3600 * 12 },
            )
            .then((pushServiceRes) =>
                res.status(pushServiceRes.statusCode).end(),
            )
            .catch((error) => {
                logger.error('POST /send-push', { error });
                res.status(error?.statusCode ?? 500).end();
            });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
