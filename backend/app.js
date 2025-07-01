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
const vouchersRouter = require('./routes/vouchers');



const paymentRouter = require("./routes/payment"); //thanh toán
const postsRouter = require('./routes/posts');
const postscategoriesRouter = require('./routes/postscategories');
const orderRoutes = require("./routes/order"); //đơn hàng
const reviewRoutes = require('./routes/review');
const usersProfileRoutes = require('./routes/userprofile'); // Đường dẫn đến routes usersProfile
const favoriteRouter = require('./routes/favorites');
const authenticateToken = require('./middleware/auth');


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
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/variants', variantsRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/vouchers', vouchersRouter);


// không cần token khi thanh toán momo
app.use("/payment", paymentRouter);
// app.use("/", paymentReturnRouter); // Để route /payment-return hoạt động tại http://localhost:3000/payment-return
// 
app.use('/favorites', favoriteRouter);
// thanh toán
app.use('/api/posts', postsRouter);
app.use('/api/postscategories', postscategoriesRouter);
app.use("/reviews", reviewRoutes);
app.use('/api/usersProfile', usersProfileRoutes);
app.use("/payment", paymentRouter); //Momo, thanh toán
app.use(require('./routes/payment')); //IPN
// app.use("/payment", require("./routes/payment")); //đường dẫn file routes/payment.js
app.use("/orders", orderRoutes);

app.use('/favorites', favoriteRouter);
app.use("/reviews", require("./routes/review"));
app.use(authenticateToken); 



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

const cron = require('node-cron');
const Voucher = require('./models/voucherModel');

// Cronjob: CHẠY MỖI GIỜ để tự động kích hoạt voucher đến ngày bắt đầu
cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  console.log('CRON TEST:', now);
  const vouchers = await Voucher.find({
    active: false,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  console.log('Voucher đủ điều kiện kích hoạt:', vouchers.length);
  try {
    const result = await Voucher.updateMany(
      {
        active: false,
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      { $set: { active: true } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[CRON] Đã tự động kích hoạt ${result.modifiedCount} voucher đến ngày bắt đầu.`);
    }
  } catch (err) {
    console.error('[CRON] Lỗi khi tự động kích hoạt voucher:', err);
  }
});

// Cronjob: CHẠY MỖI GIỜ để tự động tắt voucher khi hết hạn
cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  try {
    const result = await Voucher.updateMany(
      {
        active: true,
        endDate: { $lt: now }
      },
      { $set: { active: false } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[CRON] Đã tự động tắt ${result.modifiedCount} voucher hết hạn.`);
    }
  } catch (err) {
    console.error('[CRON] Lỗi khi tự động tắt voucher:', err);
  }
});

module.exports = app;
