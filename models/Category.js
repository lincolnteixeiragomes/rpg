const { db, Sequelize } = require('../config/db');

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

// Create table
// Category.sync({force: true})

module.exports = Category;
