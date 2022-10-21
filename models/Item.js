const { db, Sequelize } = require('../config/db');
const Category = require('./Category');
const Rarity = require('./Rarity');

const Item = db.define('item', {
  name: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.BIGINT,
  },
  categoryId: {
    type: Sequelize.INTEGER,
  },
  rarityId: {
    type: Sequelize.STRING,
  },
});

Item.belongsTo(Category, { foreignKey: 'categoryId' });
Item.belongsTo(Rarity, { foreingKey: 'rarityId' });

// Create table
// Item.sync({ force: true });

module.exports = Item;
