const { db, Sequelize } = require('../config/db');

const Rarity = db.define('rarity', {
  name: {
    type: Sequelize.STRING,
  },
});

// Create table
// Rarity.sync({force: true})

module.exports = Rarity;
