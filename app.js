require('dotenv/config');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const paginate = require('handlebars-paginate');
const passport = require('passport');
const adminRoute = require('./routes/admin');
const rootRoute = require('./routes/root');
require('./config/auth')(passport);

// Config
const app = express();

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: '1fc07e671efcf15d0241f1f126844be4',
  resave: true,
  saveUninitialized: true,
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Midleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    ifCond: (v1, v2, options) => {
      if (Number.parseInt(v1, 10) === Number.parseInt(v2, 10)) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    paginate,
  },
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Routes
app.use('/', rootRoute);
app.use('/admin', adminRoute);

// Others
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // console.log('App running at http://192.168.1.155:5000');
});
