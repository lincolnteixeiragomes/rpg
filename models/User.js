const { db, Sequelize } = require('../config/db');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    // 0 - Admin
    // 1 - Master
    // 2 - Player
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lastAccess: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

// Create table
// User.sync({ force: true });

module.exports = User;
