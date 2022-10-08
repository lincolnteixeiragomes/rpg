const Category = require('../models/Category');

// Display list of all Categories.
exports.categoryList = (req, res) => {
  Category.findAll({ order: [['name', 'ASC']] }).then((categories) => {
    res.render('admin/category', { categories });
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/category');
  });
};

// Display Category create form on GET.
exports.categoryCreateGet = (req, res) => {
  res.render('admin/addCategory');
};

// Handle Category create on POST.
exports.categoryCreatePost = (req, res) => {
  const {
    name, slug, description,
  } = req.body;
  const errors = [];
  if (!name) errors.push({ warnings: 'Invalid name' });
  if (name.length < 2) errors.push({ warnings: 'Name of category to small' });
  if (!slug) errors.push({ warnings: 'Invalid slug' });
  if (slug.includes(' ')) errors.push({ warnings: "Don't use space on slug" });

  if (errors.length > 0) {
    res.render('admin/addCategory', { errors });
  } else {
    Category.create({
      name,
      slug,
      description,
    }).then(() => {
      req.flash('success_msg', 'Category registered succefully!');
      res.redirect('/admin/category');
    }).catch((err) => {
      req.flash('error_msg', `Something goes wrong, try again!.${err.message}`);
      res.redirect('/admin/category/add');
    });
  }
};

// Display Category update form on GET.
exports.categoryUpdateGet = (req, res) => {
  const { id } = req.params;
  Category.findOne({ where: { id } }).then((category) => {
    res.render('admin/editCategory', { category });
  }).catch((err) => {
    req.flash('error_msg', `This category not exists.${err.message}`);
    res.redirect('/admin/category');
  });
};

// Handle Category update on POST
exports.categoryUpdatePost = (req, res) => {
  const {
    id, name, slug, description,
  } = req.body;
  Category.findOne({ where: { id } }).then((category) => {
    const errors = [];
    if (!name) errors.push({ warnings: 'Invalid name' });
    if (name.length < 2) errors.push({ warnings: 'Name of category to small' });
    if (!slug) errors.push({ warnings: 'Invalid slug' });
    if (slug.includes(' ')) errors.push({ warnings: "Don't use space on slug" });

    if (errors.length > 0) {
      res.render(`admin/editCategory/${id}`, { errors });
    } else {
      const newCategory = category;
      newCategory.name = name;
      newCategory.slug = slug;
      newCategory.description = description;

      newCategory.save().then(() => {
        req.flash('success_msg', 'Category updated successfully!');
        res.redirect('/admin/category');
      });
    }
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
    res.redirect('/admin/category');
  });
};

// Handle Category delete on POST
exports.categoryDeletePost = (req, res) => {
  const { checkbox } = req.body;
  Category.destroy({ where: { id: checkbox } }).then(() => {
    req.flash('success_msg', 'Categories delete successefully!');
    res.redirect('/admin/category');
  }).catch((err) => {
    req.flash('error_msg', `Something goes wrong: ${err.message}`);
  });
};
