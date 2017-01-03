import express from 'express';
import exphbs from 'express-handlebars';
import router from './router.js';
import initPassportUtils from './passportUtils';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';

var compression = require('compression');
var app = express();

app.use(compression());
app.use(express.static('public'));
app.use(flash());

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
 secret: 'Cookie secret',
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())

initPassportUtils();



app.set('view engine', '.hbs');


// app.use('/aboutus', router);
app.use('/', router);
app.all('/', function(req, res){
  req.flash('test', 'it worked');
  res.redirect('/test')
});

var port = process.env.PORT || 8080;


app.listen(port, function() {
    console.log('Example app listening on port '+port+'!');
});
