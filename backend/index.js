//import express module 
var express = require('express');
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
//require cookie parser
var cookieParser = require('cookie-parser');
//import cors
const cors = require('cors');

const { mongoDB } = require('./config/configValue');
const mongoose = require('mongoose');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

//Mongodb connect
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
  } else {
      console.log(`MongoDB Connected`);
  }
});


app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//use express session to maintain session data
app.use(session({
  secret              : 'cmpe273_kafka_passport_mongo',
  resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration      :  5 * 60 * 1000
}));

app.use(express.static('./public'));

const upload = require("./routes/uploads");
app.use("/uploads", upload);

const images = require("./routes/images");
app.use("/images", images);

// const menuitems = require("./routes/menuitems");
// app.use("/menu", menuitems);

// const menusections = require("./routes/menusections");
// app.use("/menu", menusections); 

// const restaurant = require("./routes/restaurant");
// app.use("/restaurant", restaurant); 

// const cart = require("./routes/cart");
// app.use("/cart", cart); 

// const orders = require("./routes/orders");
// app.use("/orders", orders);

//mongodb routes
var signupRouter = require('./api/signup/signup.router');
app.use('/signup', signupRouter);

var loginRouter = require('./api/login/login.router');
app.use('/login', loginRouter);

var profileRouter = require('./api/customer/customer.router');
app.use('/profile/customer', profileRouter);

var restoProfileRouter = require('./api/restaurant/restaurant.router');
app.use('/profile/restaurant', restoProfileRouter);

const restaurant = require('./api/restaurant/restaurant.router');
app.use("/restaurant", restaurant); 

const menu = require('./api/menu/menu.router');
app.use("/menu", menu);

const cart = require('./api/cart/cart.router');
app.use("/cart", cart); 

const order = require("./api/order/order.router");
app.use("/order", order);

const port = process.env.PORT || 3001;
var server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


module.exports = app;