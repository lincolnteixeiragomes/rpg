const { Sequelize } = require('../config/db');

const { Op } = Sequelize;
const Category = require('../models/Category');
const Rarity = require('../models/Rarity');
const Item = require('../models/Item');

// Display list of all Items.
exports.itemList = (req, res) => {
  Category.findAll().then((categories) => {
    Rarity.findAll().then((rarities) => {
      res.render('admin/item', { categories, rarities });
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong: ${err.message}`);
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};

// Display Item create form on GET.
exports.itemCreateGet = (req, res) => {
  Category.findAll({ order: [['name', 'ASC']] }).then((categories) => {
    Rarity.findAll({ order: [['name', 'ASC']] }).then((rarities) => {
      res.render('admin/addItem', { categories, rarities });
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong: ${err.message}`);
      res.redirect('/item');
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/item');
  });
};

// Handle Item  create on POST
exports.itemCreatePost = (req, res) => {
  const {
    name, priceForm, categoryId, rarityId, coin,
  } = req.body;

  const price = Number.parseInt(priceForm, 10) * Number.parseInt(coin, 10);
  Item.create({
    name, price, categoryId, rarityId,
  }).then(() => {
    req.flash('success_msg', 'Item registered successfuly!');
    res.redirect('/admin/item');
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong ${err.message}`);
    res.redirect('/admin/item/add');
  });
};

// Display form create on GET
exports.itemUpdateGet = (req, res) => {
  const { id } = req.params;
  Item.findOne({
    where: { id },
    include: [{
      model: Category,
    },
    {
      model: Rarity,
    }],
  }).then((item) => {
    Category.findAll().then((categories) => {
      Rarity.findAll().then((rarities) => {
        let coin = 0;
        if ((item.price / 100) > 1) {
          coin = 100;
        } else if ((item.price / 10) > 1) {
          coin = 10;
        } else {
          coin = 1;
        }

        res.render('admin/editItem', {
          item, categories, rarities, coin,
        });
      }).catch();
    }).catch();
  }).catch((err) => {
    req.flash('error_msg', `This item not exists.${err.message}`);
    res.redirect('/admin/item');
  });
};

// Handle item Updade on POST
exports.itemUpdatePost = (req, res) => {
  const {
    id, name, price, categoryId, rarityId, coin,
  } = req.body;

  Item.findOne({ where: { id } }).then((item) => {
    const errors = [];
    if (!name) errors.push({ warnings: 'Invalid name' });
    if (name.length < 2) errors.push({ warnings: 'Name of item to small' });

    if (errors.length > 0) {
      res.render(`admin/editItem/${id}`, { errors });
    } else {
      const newItem = item;
      newItem.name = name;
      newItem.price = price * coin;
      newItem.categoryId = categoryId;
      newItem.rarityId = rarityId;

      newItem.save().then(() => {
        req.flash('success_msg', 'Item updated successfully!');
        res.redirect('/admin/item');
      });
    }
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/item');
  });
};

// Item delete on POST
exports.itemDelete = (req, res) => {
  const { checkbox } = req.body;

  Item.destroy({ where: { id: checkbox } }).then(() => {
    req.flash('success_msg', 'Item delete successefully!');
    res.redirect('/admin/item');
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};

//  Filter item by user input
exports.itemFilterGet = (req, res) => {
  const {
    name, categoryId, rarityId, p, s,
  } = req.query;
  const whereClause = {};
  const pagination = {};

  if (name !== '') whereClause.name = { [Op.iLike]: `%${name}%` };
  if (Number.parseInt(categoryId, 10) !== 0) whereClause.categoryId = categoryId;
  if (Number.parseInt(rarityId, 10) !== 0) whereClause.rarityId = rarityId;

  const pageAsNumber = Number.parseInt(p, 10);
  const sizeAsNumber = Number.parseInt(s, 10);

  pagination.page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    pagination.page = pageAsNumber;
  }

  pagination.size = 10;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
    pagination.size = sizeAsNumber;
  }

  Category.findAll().then((categories) => {
    Rarity.findAll().then((rarities) => {
      Item.findAndCountAll(
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
          limit: pagination.size,
          offset: pagination.page * pagination.size,
        },
      ).then((result) => {
        const numberOfResults = result.count;
        const items = result.rows;
        const numberOfPages = Math.ceil(numberOfResults / pagination.size);
        pagination.pageCount = numberOfPages - 1;

        res.render('admin/item', {
          items,
          categories,
          rarities,
          name,
          categoryId,
          rarityId,
          pagination,
          numberOfPages,
        });
      }).catch((err) => {
        req.flash('error_msg', `Something goes wrong: ${err.message}`);
        res.redirect('/admin/item');
      });
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong: ${err.message}`);
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};
