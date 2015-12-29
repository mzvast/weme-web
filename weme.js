var express = require('express');
var http = require('http'); 
var querystring = require('querystring');
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
/*set up PORT*/
app.set('port', process.env.PORT || 3000);
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
app.get('/api',function(reqs,resp) {
	console.log("get you api endpoint!");
	// var postData = querystring.stringify({
	// 	  "token": "884d20eb7ceb8e83f8ab7cb89fa238c0"
	// 	});
	var postData = JSON.stringify({
		  "token": "884d20eb7ceb8e83f8ab7cb89fa238c0"
		});
	var options = {
		  hostname: '218.244.147.240',
		  port: 8080,
		  path: '/getprofile',
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': postData.length
		  }};
		console.log(options);
	  var req = http.request(options, function(res) {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			  });
			  res.on('end', function() {
			    console.log('No more data in response.')
			  })
			});
		  req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
			});

			// write data to request body
		req.write(postData);
		req.end();

});

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
	res.render('admin/dashboard',{layout:'main_pure'});
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
