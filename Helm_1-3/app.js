// required libraries
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MountainComplex = require( path.join(__dirname, 'mountain_complex', 'runtime', 'mountain-complex'));

// instaniate application container
var app = express();

// set clusterable session
var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
  name: 'helm',
  secret: 'mKF2fH1LgU03ev0xVCcjtB2UAG4YU41f', // http://randomkeygen.com/ , used CodeIgniter Encryption keys to keep it random but clean
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));


/*********************************************
Create Symbolic Links
*********************************************/
/*
cd /projectPath
mkdir -p public/vendor
ln -s /project_path/strawman/mountain_complex/frontend/public/vendor/mountain_complex ./public/vendor/mountain_complex
ln -s /project_path/strawman/mountain_complex/frontend/views ./views/mc

### Helm 1-3 Example
unlink ./public/vendor/mountain_complex
ln -s /shop/forged/products/Helm_1-3/mountain_complex/frontend/public/vendor/mountain_complex ./public/vendor/mountain_complex
ln -s /shop/randomsilo/products/Helm/mountain_complex/frontend/public/vendor/mountain_complex ./public/vendor/mountain_complex

unlink ./views/mc
ln -s /shop/forged/products/Helm_1-3/mountain_complex/frontend/views ./views/mc
ln -s /shop/randomsilo/products/Helm/mountain_complex/frontend/views ./views/mc
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mountain complex generated code manager
var mountainComplex = new MountainComplex( path.join(__dirname, 'mountain-complex.json'));

// set mountainComplex in app for access in routes
// - var mountainComplex = req.app.locals.settings.mountainComplex;
// - add routes for mountain complex generated code
app.set('mountainComplex', mountainComplex);
require( path.join(__dirname, 'mountain_complex', 'frontend', 'routes'))(app);

// application custom routes
// - copy mountain_complex/express/routes/app to ./routes/app
require('./routes/app')(app);

// load models
mountainComplex.loadModels( path.join(__dirname, 'mountain_complex', 'backend', 'models'));

// handle 404 and 500 errors
mountainComplex.handleErrors( app);

module.exports = app;
