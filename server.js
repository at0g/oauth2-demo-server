/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , site = require('./site')
  , oauth2 = require('./oauth2')
  , user = require('./user')
  , client = require('./client')
  , util = require('util')
  
  
// Express configuration
  
var app = express.createServer();
app.set('view engine', 'ejs');
//app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
require('./auth');


app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);



app.get('/api/userinfo', user.info);
app.get('/api/clientinfo', client.info);


app.get('/protected-endpoint',
    passport.authenticate('bearer', {session: false}),
    function(req, res){
        res.json(req.user.name);
    }
);

app.listen(process.env.PORT || 3000);
