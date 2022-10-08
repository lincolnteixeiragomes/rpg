// Display home for admin
exports.indexGet = (req, res) => {
  res.render('home');
};

// Login
exports.login = (req, res) => {
  res.render('login');
};
