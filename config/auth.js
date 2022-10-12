const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// eslint-disable-next-line func-names
module.exports = function (passport) {
  // eslint-disable-next-line new-cap
  passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    // eslint-disable-next-line consistent-return
    User.findOne({ where: { email } }).then((user) => {
      if (!user) {
        return done(null, false, { message: 'This account does not exists!' });
      }
      bcrypt.compare(password, user.hash, (err, match) => {
        if (match) {
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect password!' });
      });
    });
  }));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
      done(null, user);
    });
  });
};
