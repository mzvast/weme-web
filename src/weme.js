/*eslint-env node*/
/*eslint-disable no-alert, no-console */
/*eslint-disable no-unused-vars*/
var express = require('express');
var http = require('http'); 
// var querystring = require('querystring');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multiparty = require("multiparty");
var flash = require('express-flash');
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
app.use(express.static(__dirname+'/public'));
app.use('/bower_components',  express.static(__dirname+'/bower_components'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 
app.use(cookieParser());
app.use(flash());
app.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: { maxAge: 600 * 60 * 1000 },
	resave: true,
	saveUninitialized: true
}));
app.use(function(req,res,next) {
	req.session.isLogin=req.session.isLogin||false;
	req.session.isAdmin=req.session.isAdmin||false;
	res.cookie('token',(req.cookies.token?req.cookies.token:''),{ maxAge: 600 * 60 * 1000 });
	console.log('cookies token: '+req.cookies.token);
	next();
});

/*set up Routers*/
app.use('/auth', router);

router.get('/logout', function(req, res) {
	req.session.destroy();
	res.clearCookie('token');
	res.redirect(301,'auth/login');  
});
router.get('/login', function(req, res) {
	console.log('session login state: '+req.session.isLogin);
	console.log('session Admin state: '+req.session.isAdmin);
	console.log('cookies token: '+req.cookies.token);
	if (req.session.isAdmin&&req.session.isLogin) {
		res.redirect(301,'/admin/publish');
	}
	else if(req.session.isLogin){
		res.redirect(301,'/user/home');
	}
	else{
		// res.clearCookie('token');
		res.render('auth/login');  
	}	
});
router.get('/register', function(req, res) {
	res.render('auth/register');  
});
router.post('/login', function(httpRequest, httpResponse) {
	var request = require('request-json');
	var client = request.createClient('http://218.244.147.240:8080/');
	console.log('====login====='+new Date());
	client.post('/login', httpRequest.body, function(err, res, body) {
		   try{
			   	if (res&&body) {
			   		if (body['state']==='successful') {
						httpRequest.session.isLogin=true;//session SET!
						//session Admin SET!
						httpRequest.session.isAdmin=(httpRequest.body.username=='administrator'?true:false);
						httpResponse.cookie('token',body['token']);//cookies store token
						httpRequest.session.username = httpRequest.body.username;//SET session username
						console.log(httpRequest.body.username+' || (login,Admin):( '+httpRequest.session.isLogin,','+httpRequest.session.isAdmin+')');
						console.log('cookies token:' +body['token']);
						if (httpRequest.session.isAdmin) {
							httpResponse.redirect(301,'/admin/publish');//login to Admin
						} else{
							httpResponse.redirect(301,'/user/home');
						}
						/*登陆成功数据处理*/
							// httpResponse.render('auth/login',{session:httpRequest.session});
						console.log('======login success!======');
					}else {
						console.log('======login fail!======');
						console.log(body['reason']);
						httpRequest.flash('msg', body['reason']);
							// httpRequest.flash('msg', 'smsmsmsmsm');
						httpResponse.redirect(301,'/auth/login');
					}
			   	}
		   }
		   catch(err){
		   		httpResponse.send('sorry error,please retry later');
		   		return console.log(err);
		   }
	   }
	);

});
router.post('/register', function(request, response) {
	// request.session.isLogin=false;
	console.log('=======register=======');
	console.log('session login state: '+request.session.isLogin);
	// response.send(request.body); 
	var data='';
	var postData = JSON.stringify(request.body);
	var options = {
		hostname: '218.244.147.240',
		port: 8080,
		path: '/register',
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
			// console.log('BODY: ' + chunk);
			data=chunk;
		});
		res.on('end', function() {
		// console.log('No more data in response.');
			try {
				var json_data = JSON.parse(data);
			}
				catch(err) {
					console.log(err);
					response.send('error,please retry later');
				}
			if (json_data['state']==='successful') {
				request.session.isLogin=true;//session SET!
				request.session.isAdmin=true;//session SET!
				response.cookie('token',json_data['token']);//cookies store token
				console.log('request.cookies.token: '+json_data['token']);
				console.log('session login state: '+request.session.isLogin);
				request.flash('msg','注册成功');
				/*登陆成功数据处理*/
					// response.render('auth/login',{session:request.session});
				response.redirect(301,'/user/home');//login to Admin
				console.log('======register success!======');
			}else {
				console.log('======register fail!======');
				console.log(json_data['reason']);
				request.flash('msg', json_data['reason']);
				// request.flash('msg', 'smsmsmsmsm');
				response.redirect(301,'/auth/register');
			}
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		console.log('========register error=======');
	});

			// write data to request body
	req.write(postData);
	req.end();
});

app.post('/api/post/:path',function(httpRequest,httpResponse) {
	var request = require('request-json');
	var client = request.createClient('http://218.244.147.240:8080/');
	console.log('========api======='+new Date());
	client.post(httpRequest.params.path, httpRequest.body, function(err, res, body) {
		   try{
			   	if (res&&body) {
				 	return httpResponse.send(body);
			   	}
		   }
		   catch(err){
		   		return console.log(err);
		   }
	   }
	);
});

app.post('/api-multipart/:path/',function(httpRequest, httpResponse, next) {
    var form = new multiparty.Form();

    form.on("part", function(part){
    	var FormData = require("form-data");
    	var form = new FormData();
        form.append('json', httpRequest.headers['json']);//form-data JSON内容!important!
            // console.log('json======',httpRequest.headers['json']);
    	
    	if (!part.filename) {
		    // console.log('got field named ' + part.name);
		    part.resume();
		  }

        if(part.filename)
        {
			var request = require("request");
		    console.log('got file named ' + part.name);
            var filename = part.filename;
            var size = part.byteCount;
		    console.log('got file size ' + size);
            form.append('avatar',part,{
                                          filename: part.filename,
                                          contentType: part.headers['content-type'],
                                          knownLength: part.byteCount
                                        });
        
    	var r = request.post('http://218.244.147.240:80/'+httpRequest.params.path,function(err, res, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              // console.log('Upload successful!  Server responded with:', body);
		    // console.log('res headers ' + res.headers);
              httpResponse.send(body);
            });
            r._form = form;
        }
    });

    form.on("error", function(error){
        console.log(error);
    });

    form.parse(httpRequest);
});

app.get('/api-img/:path',function(request,response) {
	console.log('========api======='+new Date());
	// console.log('method: '+request.params.method);
	// console.log('body: '+ request.body.token);
	// console.log('path: /'+request.params.path);
	// var postData = querystring.stringify({
	// 	  'token': '884d20eb7ceb8e83f8ab7cb89fa238c0'
	// 	});
	var data='';
	var options = {
		hostname: '218.244.147.240',
		port: 80,
		path: '/picture/activitylifeimages/'+request.params.path,
		method: "GET",
		headers: {
			'Content-Type': 'image/jpg'
		}};
		// console.log(options);
	var req = http.request(options, function(res) {
		// console.log('STATUS: ' + res.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			// console.log('BODY: ' + chunk);
			data+=chunk.replace('BODY:','');//多段数据合成，去除穿插的BODY:字符
		});
		res.on('end', function() {
			// console.log('No more data in response.');
				response.send(data);//send data back to front end	
				console.log('========api-img success=======');
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			console.log('========api-img error=======');
		});

		req.end();

});

app.get('/1', function(req, res) {
	res.render('landing_mix',{layout:'main_bt'});
});
app.get('/', function(req, res) {
	// res.redirect(301,'/auth/login');//调试方便，临时重定向
	res.render('landing',{layout:'main_bt'});
});
// app.get('/home', function(req, res) {
// 	res.render('home');
// });

app.get('/jquery', function(req, res) {
	res.render('jquery-test');
});

/*保护user下面的路由必须Login才可以访问*/
router.use(function(req, res, next) {
	console.log('user login state: '+req.session.isLogin);
	if (req.session.isLogin===true) {
		next();  
	}else{
		res.redirect(301,'/auth/login');
	}
});
app.use('/user', router);

router.get('/home',function(req,res) {
	res.render('user/home',{session:req.session});
});
router.get('/activity',function(req,res) {
	res.render('user/activity',{session:req.session});
});
router.get('/activity/manage',function(req,res) {
	res.render('user/activity/manage',{session:req.session});
});
router.get('/community',function(req,res) {
	res.render('user/community',{session:req.session});
});

/*保护下面的路由必须isAdmin才可以访问,临时关闭，方便调试*/
app.use(function(req, res, next) {
	console.log('user admin state: '+req.session.isAdmin);
	if (req.session.isAdmin===true) {
		next();  
	}else{
		res.render('404');
	}
});
app.use('/admin', router);
router.get('/', function(req, res) {
	res.render('admin/dashboard',{layout:'main_pure',session:req.session});
});
router.get('/eventRegister', function(req, res) {
	console.log('cookies token: '+req.cookies.token);
	res.render('admin/eventRegister',{layout:'main_pure',session:req.session});
});
router.get('/card', function(req, res) {
	console.log('cookies token: '+req.cookies.token);
	res.render('admin/card',{layout:'main_pure',session:req.session});
});
router.get('/publish', function(req, res) {
	console.log('cookies token: '+req.cookies.token);
	res.render('admin/publish',{layout:'main_pure',session:req.session});
});
router.get('/certificate', function(req, res) {
	console.log('cookies token: '+req.cookies.token);
	res.render('admin/certificate',{layout:'main_pure',session:req.session});
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
