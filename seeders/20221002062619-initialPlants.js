'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Plants', [
            {
                id: 1,
                plantName: '카스테라',
                wateringDate: '21',
                lastWateringDate: '2022/10/01',
                creatorId: 'J',
                imageUrl: 'profile1.png',
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Plants', null, {});
    },
};
