const router = require('express').Router();
const { scheduleJob } = require('node-schedule');
const webpush = require('web-push');
const db = require('../models');

const { User } = db;

const SUBJECT = '';
const VAPID_PUBLIC = '';
const VAPID_PRIVATE = '';

const store = { data: [] };

router.get('/vapid', (req, res) => {
    res.send(VAPID_PUBLIC);
});

router.post('/subscription', async (req, res) => {
    const { userId, subscription } = req.body;

    const index = store.data.findIndex((data) => data.userId === userId);
    if (~index) store.data[index].subscription = subscription;

    store.data.push({ userId, subscription });
    const data = JSON.stringify(store.data);

    if (data) {
        res.send(data);
    }
});

router.delete('/subscription', (req, res) => {
    const { userId } = req.body;

    const index = store.data.findIndex((data) => data.userId === userId);
    if (~index) {
        store.data.splice(index, 1);
    }

    const data = JSON.stringify(store.data);

    if (data) {
        res.send(data);
    }
});

router.post('/send-push-notification', (req, res) => {
    const { targetId: targetUserId, message, date } = req.body ?? {};

    const targetUser = store.data
        .reverse()
        .find(({ userId }) => userId === targetUserId);

    if (targetUser) {
        const messageData = {
            title: '식물 알람 | Plant Alarm',
            body: message || '(Empty message)',
        };
        const alarmDate = date; // 날짜로 변환해주기

        scheduleJob(alarmDate, () => {
            webpush
                .sendNotification(
                    targetUser.subscription,
                    JSON.stringify(messageData),
                )
                .then((pushServiceRes) =>
                    res.status(pushServiceRes.statusCode).end(),
                )
                .catch((error) => {
                    logger.error('POST /send-push', { error });
                    res.status(error?.statusCode ?? 500).end();
                });
        });
    } else {
        res.status(404).end();
    }
});
