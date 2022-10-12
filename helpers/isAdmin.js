module.exports = {
  // eslint-disable-next-line consistent-return
  isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 0) {
      return next();
    }
    req.flash('error_msg', 'You need to be admin!');
    res.redirect('/');
  },
};
