var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
var config = require("./config/config");
mongoose.connect(config.local.db, { useNewUrlParser: true });
const fileUpload = require('express-fileupload');
//console.log(__dirname);
var fs = require("fs");
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
   // console.log(file);
    require(models_path + '/' + file);
});
var User = mongoose.model("User");
var Ticket = mongoose.model("Ticket");
require('./config/passport')(passport);
app.use(express.static(path.join(__dirname, "../dist/train/")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//app.use(requestLogger);
app.use(fileUpload());
//Bootstrap routes
var routes = require('./config/routes')(app, passport);
app.use('/', routes);
app.use(router);
app.listen(3500);
console.log("server is listening on port 3500");
