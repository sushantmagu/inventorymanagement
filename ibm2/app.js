


var express = require('express');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var path=require('path');



var app = express();






// view engine setup

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true,
  secret: 'uwotm8' }));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
app.use(multer());

app.use(express.static(path.join(__dirname, 'public')));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res) {
  res.render('index.ejs');
});
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hockey');
var productSchema = new mongoose.Schema({
  prdId: String,
  name: { type: String },
  price: Number
})

var Product = mongoose.model('Product', productSchema);
app.get('/add', function(req,res) {
  res.render('addProduct.ejs');
});

app.post('/new', function(req, res){
  new Product({
    prdId : req.body.ProductId,
    name  : req.body.ProductName,
    price   : req.body.ProductPrice
  }).save(function(err, prd){
        if(err) res.json(err);
        else    res.send("Product Successfully Added !");
      });
});
app.get('/viewall', function(req,res) {
  Product.find({}, function(err, prds) {
    console.log("\nProducts !");
    console.log(prds);
    renderResult(res, prds, "Product List from MongoDB :");
  });});

function renderResult(res, prds, msg) {
  res.render('display.ejs', {message:msg, products:prds},
      function(err, result) {
        if (!err) {res.end(result);}
        else {res.end('Oops ! An error occurred.');
          console.log(err);}
      });}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
