var express = require('express');
var app = express();
// set up handlebars view engine
var exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({
	defaultLayout: 'main_bt',
	helpers: {
		section: function(name, options) {
			if (!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
}));
app.set('view engine', 'handlebars');
/*set up ReactJS*/
var React = require('react');
var ReactDOM = require('react-dom');
/*set up PORT*/
app.set('port', process.env.PORT || 8080);
/*set up STATIC file folder*/
app.use(express.static(__dirname + '/public'));

var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple.",
];
/*set up Routers*/
app.get('/1', function(req, res) {
	res.render('landing_mix',{layout:'main_bt'});
});
app.get('/', function(req, res) {
	res.render('landing',{layout:'main_bt'});
});
app.get('/home', function(req, res) {
	res.render('home');
});
app.get('/admin', function(req, res) {
	res.render('admin');
});
app.get('/about', function(req, res) {
	var randomFortune =
		fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
	res.render('about', {
		fortune: randomFortune
	});
});
app.get('/jquery', function(req, res) {
	res.render('jquery-test');
});

/*set up Error handler*/
// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
	res.status(404);
	res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});
/*Start up the App*/
app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});
