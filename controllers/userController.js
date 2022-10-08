const bcrypt = require('bcryptjs');
const { Sequelize } = require('../config/db');

const { Op } = Sequelize;
const User = require('../models/User');

// Display page of list Users.
exports.userList = (req, res) => {
  res.render('admin/user');
};

// Display user create form on GET
exports.userCreateGet = (req, res) => {
  res.render('admin/addUser');
};

exports.userCreatePost = (req, res) => {
  const {
    name, nickname, email, password, password2, role,
  } = req.body;

  const errors = [];
  if (!name) errors.push({ warnings: 'Invalid name' });
  if (password !== password2) errors.push({ warnings: 'Password not match' });
  if (name.length < 2) errors.push({ warnings: 'Name of user to small' });

  // to valid password
  // const result = bcrypt.compareSync('my password', hash)
  // result == true or result == false

  if (errors.length > 0) {
    res.render('admin/addUser', { errors });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        req.flash('error_msg', `Something goes wrong ${err.message}`);
        res.redirect('/admin/user/add');
      }
      bcrypt.hash(password, salt, (err2, hash) => {
        if (err) {
          req.flash('error_msg', `Something goes wrong ${err2.message}`);
          res.redirect('/admin/user/add');
        }
        User.findOne({
          where:
            { [Op.or]: [{ nickname }, { email }] },
        }).then((user) => {
          if (!user) {
            User.create({
              name, nickname, email, hash, role,
            }).then(() => {
              req.flash('success_msg', 'User registered succefully!');
              res.redirect('/admin/user');
            }).catch((err3) => {
              req.flash('error_msg', `Something goes wrong, try again!.${err3.message}`);
              res.redirect('/admin/user/add');
            });
          } else {
            req.flash('error_msg', 'Nickname/E-mail already exists!');
            res.redirect('/admin/user/add');
          }
        }).catch((err4) => {
          req.flash('error_msg', `Something goes wrong, try again!.${err4.message}`);
          res.redirect('/admin/user/add');
        });
      });
    });
  }
};

// Handle User delete on POST
exports.userDelete = (req, res) => {
  const { checkbox } = req.body;
  if (!checkbox) {
    req.flash('error_msg', 'You need to select some user to delete!');
    res.redirect('/admin/user');
  }
  User.destroy({ where: { id: checkbox } }).then(() => {
    req.flash('success_msg', 'User delete successefully!');
    res.redirect('/admin/user');
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};

exports.userUpdateGet = (req, res) => {
  const { id } = req.params;
  User.findOne({ where: { id } }).then((user) => {
    res.render('admin/editUser', { user });
  }).catch((err) => {
    req.flash('error_msg', `This user not exists.${err.message}`);
    res.redirect('/admin/user');
  });
};

exports.userUpdatePost = (req, res) => {
  const {
    id, name, nickname, email, password, password2, role,
  } = req.body;
  User.findOne({ where: { id } }).then((user) => {
    // Data validation
    const errors = [];
    if (!name) errors.push({ warnings: 'Invalid name' });
    if (password !== password2) errors.push({ warnings: 'Password not match' });
    if (name.length < 2) errors.push({ warnings: 'Name of user to small' });

    if (errors.length > 0) {
      res.render(`admin/editUser/${id}`, { errors });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          req.flash('error_msg', `Something goes wrong ${err.message}`);
          res.redirect('/admin/user');
        }
        bcrypt.hash(password, salt, (err2, hash) => {
          if (err2) {
            req.flash('error_msg', `Something goes wrong ${err2.message}`);
            res.redirect('/admin/user');
          }
          const newUser = user;
          newUser.name = name;
          newUser.nickname = nickname;
          newUser.email = email;
          newUser.role = role;
          newUser.hash = hash;
          newUser.save().then(() => {
            req.flash('success_msg', 'User updated successfully!');
            res.redirect('/admin/user');
          });
        });
      });
    }
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/category');
  });
};

exports.userFilterGet = (req, res) => {
  const {
    name, nickname, email, role, p, s,
  } = req.query;
  const whereClause = {};
  const pagination = {};

  if (name !== '') whereClause.name = { [Op.iLike]: `%${name}%` };
  if (nickname !== '') whereClause.nickname = { [Op.iLike]: `%${nickname}%` };
  if (email !== '') whereClause.email = { [Op.iLike]: `%${email}%` };
  if (role !== '99') whereClause.role = { [Op.eq]: role };

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

  User.findAndCountAll(
    {
      where: whereClause,
      order: [['name', 'ASC']],
      limit: pagination.size,
      offset: pagination.page * pagination.size,
    },
  ).then((result) => {
    console.log(result);
    const numberOfResults = result.count;
    const users = result.rows;
    const numberOfPages = Math.ceil(numberOfResults / pagination.size);
    pagination.pageCount = numberOfPages - 1;
    res.render('admin/user', {
      users, name, nickname, email, role, pagination, numberOfPages,
    });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/user');
  });
};
