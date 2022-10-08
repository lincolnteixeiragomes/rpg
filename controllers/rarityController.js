const Rarity = require('../models/Rarity');

// Display list of all Rarities.
exports.rarityList = (req, res) => {
  Rarity.findAll({ order: [['name', 'ASC']] }).then((rarities) => {
    res.render('admin/rarity', { rarities });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/rarity');
  });
};

// Display Rarity create form on GET.
exports.rarityCreateGet = (req, res) => {
  res.render('admin/addRarity');
};

// Handle Category create on POST
exports.rarityCreatePost = (req, res) => {
  const { name } = req.body;
  const errors = [];
  if (!name) errors.push({ warnings: 'Invalid name' });

  if (name.length < 2) {
    errors.push({ warnings: 'Name of rarity to small' });
  }

  if (errors.length > 0) {
    res.render('admin/addRarity', { errors });
  } else {
    Rarity.create({
      name,
    }).then(() => {
      req.flash('success_msg', 'Rarity registered succefully!');
      res.redirect('/admin/rarity');
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong, try again!.${err.message}`);
      res.redirect('/admin/rarity/add');
    });
  }
};

// Display Rarity form update on GET
exports.rarityUpdateGet = (req, res) => {
  const { id } = req.params;
  Rarity.findOne({ where: { id } }).then((rarity) => {
    res.render('admin/editRarity', { rarity });
  }).catch((err) => {
    req.flash('error_msg', `This rarity not exists.${err.message}`);
    res.redirect('/admin/rarity');
  });
};

// Handle Rarity update on POST
exports.rarityUpdatePost = (req, res) => {
  const { id, name } = req.body;

  Rarity.findOne({ where: { id } }).then((rarity) => {
    const errors = [];
    if (!name) errors.push({ warnings: 'Invalid name' });
    if (name.length < 2) errors.push({ warnings: 'Name of rarity to small' });

    if (errors.length > 0) {
      res.render(`admin/editRarity/${id}`, { errors });
    } else {
      const newRarity = rarity;
      newRarity.name = name;

      newRarity.save().then(() => {
        req.flash('success_msg', 'Rarity updated successfully!');
        res.redirect('/admin/rarity');
      });
    }
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/rarity');
  });
};

// Handle Rarity delete on POST
exports.rarityDelete = (req, res) => {
  const { checkbox } = req.body;

  Rarity.destroy({ where: { id: checkbox } }).then(() => {
    req.flash('success_msg', 'Rarity delete successefully!');
    res.redirect('/admin/rarity');
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};
