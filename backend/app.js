require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Shopgaubong')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

var cors = require('cors'); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel'); // Đảm bảo đúng đường dẫn

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/products');
const variantsRouter = require('./routes/variants');
const subcategoryRouter = require('./routes/subcategory');


var app = express();

// Thêm cấu hình session (phải đặt trước passport)
app.use(session({
  secret: 'g4uB0ng!2025@randomSecretKey',
  resave: false,
  saveUninitialized: true
}));

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/users/auth/google/callback"
},
async (_accessToken, _refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    // Lấy username từ displayName hoặc tự tạo
    const username = profile.displayName
      ? profile.displayName.replace(/\s+/g, '').toLowerCase()
      : profile.emails[0].value.split('@')[0];
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      username: username
    });
  }
  return done(null, user);
}
));



passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/variants', variantsRouter);
app.use('/subcategory', subcategoryRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
