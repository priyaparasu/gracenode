import express from 'express'
import exphbs from 'express-handlebars';
import router from './router.js'

var compression = require('compression');
var app = express();
app.use(compression());
app.use(express.static('public'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


// app.use('/aboutus', router);
app.use('/', router);
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Example app listening on port '+port+'!');
});
