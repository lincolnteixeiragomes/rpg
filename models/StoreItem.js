const { db } = require('../config/db');
const Store = require('./Store');
const Item = require('./Item');

const StoreItem = db.define('StoreItem', {
});

Item.belongsToMany(Store, { through: StoreItem });
Store.belongsToMany(Item, { through: StoreItem });

// Create table
// StoreItem.sync({ force: true });

module.exports = StoreItem;
