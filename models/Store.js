const { db, Sequelize } = require('../config/db');

const Store = db.define('store', {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Create table
// Store.sync({ force: true });

module.exports = Store;
