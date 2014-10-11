/* Module dependencies */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');
var routes = require('./routes');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

app.get('/', function (req, res) {
    res.render('index', { title: 'Home' })
})
app.get('/review', function (req, res) {
    res.render('review', { title: 'Review' })
})
app.get('/getYousayData', routes.getYousayData);

app.listen(3000)