const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('../config/db');

const { Op } = Sequelize;
const User = require('../models/User');
const mail = require('../config/mail');

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

// Login
exports.login = (req, res) => {
  res.render('login');
};

exports.loginPost = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  // eslint-disable-next-line consistent-return
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success_msg', 'successfully logged out');
    res.redirect('/');
  });
};

// Display user create form on GET
exports.userRegisterGet = (req, res) => {
  res.render('register');
};

exports.userRegisterPost = (req, res) => {
  const {
    name, nickname, email, password, password2,
  } = req.body;
  const role = 2; // Player role
  const errors = [];
  if (!name) errors.push({ warnings: 'Invalid name' });
  if (password !== password2) errors.push({ warnings: 'Password not match' });
  if (name.length < 2) errors.push({ warnings: 'Name of user to small' });

  if (errors.length > 0) {
    res.render('register', { errors });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        req.flash('error_msg', `Something goes wrong ${err.message}`);
        res.redirect('/register');
      }
      bcrypt.hash(password, salt, (err2, hash) => {
        if (err) {
          req.flash('error_msg', `Something goes wrong ${err2.message}`);
          res.redirect('/register');
        }
        User.findOne({
          where:
            { [Op.or]: [{ nickname }, { email }] },
        }).then((user) => {
          if (!user) {
            User.create({
              name, nickname, email, hash, role,
            }).then(() => {
              const emailTo = 'lincolnteixeiragomes@gmail.com';
              const subject = 'Teste de e-mail';
              const message = 'Minha message';

              // implement your spam protection or checks.
              mail.sendMail(name, emailTo, subject, message);

              req.flash('success_msg', 'User registered succefully!');
              res.redirect('/');
            }).catch((err3) => {
              req.flash('error_msg', `Something goes wrong, try again!.${err3.message}`);
              res.redirect('/register');
            });
          } else {
            req.flash('error_msg', 'Nickname/E-mail already exists!');
            res.redirect('/register');
          }
        }).catch((err4) => {
          req.flash('error_msg', `Something goes wrong, try again!.${err4.message}`);
          res.redirect('/register');
        });
      });
    });
  }
};

// Display user reset password form on GET
exports.userResetPasswordGet = (req, res) => {
  res.render('passwordReset');
};

// Handle user account to send reset link
exports.userResetPasswordPost = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      const linkPasswordRecovery = `192.168.18.182:5000/resetpwd?uid=${user.id}&hash=${user.hash}`;
      console.log(linkPasswordRecovery);
      const emailTo = email;
      const subject = 'Password Reset - RPG';
      const message = `To reset your password click on link -> http://${linkPasswordRecovery}`;

      // implement your spam protection or checks.
      mail.sendMail(user.name, emailTo, subject, message);

      res.render('resetPasswordSent');
    } else {
      const errors = [];
      errors.push({ warnings: 'Sorry! e-mail not found in our database.' });
      res.render('passwordReset', { errors, email });
    }
  });
};

exports.userPasswordChangeGet = (req, res) => {
  const { uid, hash } = req.query;
  const id = uid;

  if (hash && id) {
    User.findOne({
      where:
        { [Op.and]: [{ id }, { hash }] },
    }).then((user) => {
      if (user) res.render('passwordChange', { hash, id });
      if (!user) res.render('userNotFound');
    });
  } else {
    res.render('dangerousTry');
  }
};

exports.userPasswordChangePost = (req, res) => {
  const {
    id, secret, password, password2,
  } = req.body;

  const errors = [];
  if (password !== password2) errors.push({ warnings: 'Password not match' });
  if (errors.length > 0) {
    res.render('passwordChange', { errors, hash: secret, id });
  } else if (secret && id) {
    User.findOne({ where: { [Op.and]: [{ id }, { hash: secret }] } }).then((user) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          req.flash('error_msg', `Something goes wrong ${err.message}`);
          res.redirect('/');
        }
        bcrypt.hash(password, salt, (err2, hash) => {
          if (err2) {
            req.flash('error_msg', `Something goes wrong ${err2.message}`);
            res.redirect('/');
          }
          const newUser = user;
          newUser.hash = hash;
          newUser.save().then(() => {
            req.flash('success_msg', 'Password updated successfully!');
            res.redirect('/login');
          });
        });
      });
    });
  } else {
    res.render('dangerousTry');
  }
};
