var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');
var routes = require('./routes/index');
var yousay = require('./routes/yousay');

var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session({ secret: 'my_secret', cookie: { maxAge: 600000 } }));

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/auth', routes.auth);
app.get('/review', routes.review);
app.get('/contact', routes.contact);
app.post('/contact', routes.contact);
app.get('/yousay_data', yousay.yousay_data);
app.get('/mtnc', routes.mtnc);

app.listen(3000)