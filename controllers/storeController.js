const crypto = require('crypto');
const { Sequelize } = require('../config/db');

const { Op } = Sequelize;
const Category = require('../models/Category');
const Rarity = require('../models/Rarity');
const Item = require('../models/Item');
const Store = require('../models/Store');
const StoreItem = require('../models/StoreItem');

// Display filter store on GET
exports.storeList = (req, res) => {
  Category.findAll().then((categories) => {
    Rarity.findAll().then((rarities) => {
      res.render('admin/addStore', { categories, rarities });
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong: ${err.message}`);
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};

// Handle Store on create POST
exports.storeGeneratorPost = (req, res) => {
  const {
    name, priceMin, coinMin, priceMax, coinMax, size, searchCategories, searchRarities,
  } = req.body;
  const whereClause = {};

  let minimum = 0;
  if (priceMin) minimum = Number.parseInt(priceMin, 10) * Number.parseInt(coinMin, 10);

  let maximum = 100000000;
  if (priceMax) maximum = Number.parseInt(priceMax, 10) * Number.parseInt(coinMax, 10);

  whereClause.price = { [Op.between]: [minimum, maximum] };

  if (searchCategories) whereClause.categoryId = { [Op.in]: searchCategories };
  if (searchRarities) whereClause.rarityId = { [Op.in]: searchRarities };

  let delimiter = 1;
  if (size) delimiter = size;

  const hash = crypto.randomBytes(20).toString('hex');
  Category.findAll().then((categories) => {
    Rarity.findAll().then((rarities) => {
      Item.findAll(
        {
          where: whereClause,
          include: [
            {
              model: Category,
              required: true,
            },
            {
              model: Rarity,
              required: true,
            }],
          order: [['name', 'ASC']],
        },
      ).then((result) => {
        let items = [];
        if (result.length > delimiter) {
          result.sort(() => Math.random() - 0.5);
          items = result.slice(0, delimiter);
        } else {
          items = result;
        }
        Store.create({
          name, hash, items,
        }).then((store) => {
          console.log(store.id);
          items.forEach((item) => {
            console.log(item.id);
            StoreItem.create({ itemId: item.id, storeId: store.id });
          });
        });
        console.log(items);

        res.render('admin/addStore', {
          items,
          categories,
          rarities,
          name,
          hash,
        });
      }).catch((err) => {
        req.flash('error_msg', `Something goes wrong: ${err.message}`);
        res.redirect('admin/addStore');
      });
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong: ${err.message}`);
      res.redirect('admin/addStore');
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('admin/addStore');
  });
};

exports.storeFind = (req, res) => {
  const { hash } = req.query;
  if (hash) {
    Store.findOne({
      where: { hash },
      include: [{
        model: Item,
        include: [
          {
            model: Category,
            required: true,
          },
          {
            model: Rarity,
            required: true,
          }],
      },
      ],
      order: [
        [{ model: Item }, 'name', 'ASC'],
      ],
    }).then((store) => {
      res.render('store', { store });
    });
  } else {
    res.render('store');
  }
};
