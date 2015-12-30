var express = require('express');
var http = require('http'); 
var querystring = require('querystring');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
// set up handlebars view engine
var exphbs = require('express-handlebars');
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
app.use('/auth',express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 1000 }
}));
/*set up Routers*/

router.get('/login', function(req, res) {
	// req.session.isLogin=false;
	console.log("session login state: "+req.session.isLogin);
    res.render('auth/login');  
});
router.post('/login', function(request, response) {
	// request.session.isLogin=false;
	console.log("session login state: "+request.session.isLogin);
	// response.send(request.body); 


	var data="";
	var postData = JSON.stringify(request.body);
	var options = {
		  hostname: '218.244.147.240',
		  port: 8080,
		  path: '/login',
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': postData.length
		  }};
		// console.log(options);
	  var req = http.request(options, function(res) {
			  // console.log('STATUS: ' + res.statusCode);
			  // console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			    data=chunk;
			  });
			  res.on('end', function() {
			    console.log('No more data in response.');
			    var json_data = JSON.parse(data)
			    if (json_data["state"]==="successful") {
			    	console.log('login success!');
			    	request.session.isLogin=true;
			    	console.log("session login state: "+request.session.isLogin);
			  		response.redirect(301,'/admin');//login to Admin
			    };
			  });
			});
		  req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
			});

			// write data to request body
		req.write(postData);
		req.end();
	// response.redirect('/admin'); 
    // var postData = JSON.stringify(request.body);
    // console.log("empty token: "+postData);
    // if (!postData.token) {
    // 	console.log("empty token: "+postData);
    // } else 
    // {
    // 	console.log("successful: "+postData);
    // };  
});
app.post('/api/:method/:path',function(request,response) {
	console.log("get you api endpoint!");
	console.log("method: "+request.params.method);
	console.log("body: "+ request.body.token);
	console.log("path: /"+request.params.path);
	// var postData = querystring.stringify({
	// 	  "token": "884d20eb7ceb8e83f8ab7cb89fa238c0"
	// 	});
	var data="";
	var postData = JSON.stringify(request.body);
	var options = {
		  hostname: '218.244.147.240',
		  port: 8080,
		  path: '/'+request.params.path,
		  method: request.params.method.toUpperCase(),
		  headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': postData.length
		  }};
		// console.log(options);
	  var req = http.request(options, function(res) {
			  // console.log('STATUS: ' + res.statusCode);
			  // console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			    data=chunk;
			  });
			  res.on('end', function() {
			    console.log('No more data in response.');
			  	response.send(data);//send data back to front end
			    var json_data = JSON.parse(data)
			    if (request.params.path==='login'&&json_data["state"]==="successful") {
			    	console.log('login success!');
			    	request.session.isLogin=true;
			    	console.log("session login state: "+request.session.isLogin);
			    };
			  });
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
// app.get('/home', function(req, res) {
// 	res.render('home');
// });
app.get('/admin', function(req, res) {
	console.log("session login state: "+req.session.isLogin);
	if (req.session.isLogin==undefined||!req.session.isLogin) {
		res.redirect(301,'/auth/login');
	} 
		else{
			res.render('admin/dashboard',{layout:'main_pure'});
		};
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
app.use('/auth', router);
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
