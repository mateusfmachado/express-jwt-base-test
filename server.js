// LIBRARIES
const express = require('express')
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var morgan = require('morgan')
var cors = require('cors')

// CONSTANTS
const PORT = process.env.PORT || 9800

// EXEC
const app = express()

// DATABASE CONNECTION
var isProduction = process.env.NODE_ENV === 'production';
if(isProduction){
  mongoose.connect('mongodb://localhost:27017/'+process.env.MONGODB_NAME);
} else {
  mongoose.connect('mongodb://localhost:27017/express-jwt-dev');
}

// LOGGER
if(process.env.NODE_ENV != 'TEST') app.use(morgan('tiny'));

// SETUP CORS
app.use(cors());
app.disable('x-powered-by');

// STATIC FOLDERS
app.use('/public', express.static(__dirname + '/public'));

// METHODS SETUP
app.use(bodyParser.urlencoded({ extended: false, limit:1024*1024*1.5 }))
app.use(bodyParser.json({ limit:1024*1024*1.5 }))

// SETUP LOCAL LOGIN
require('./models/user');
require('./config/passport');

// REMOVE EXPRESS TAG FROM HEADERS
app.use(function (req, res, next) {
    res.removeHeader("x-powered-by");
    next();
});

// ROUTES
app.use('/', require('./routes'));

// HANDLE NOT FOUND 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
// HANDLE ALL KINDS OF ERROR (422, 401, 500, ...)
  
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
        message: err.message,
        error: {}
    }});
});
  

// STARTUP
app.listen(PORT,() => console.log('Running on localhost:'+PORT) )

module.exports = app