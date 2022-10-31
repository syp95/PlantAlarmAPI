const Sequelize = require('sequelize');
const config = require('../config/config.json');

const { username, password, database, host, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

const Plant = require('./plant')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);

const db = {};
db.Plant = Plant;
db.User = User;
db.Notification = Notification;

module.exports = db;
