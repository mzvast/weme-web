/*eslint-env node*/
/*eslint-disable no-alert, no-console */
/*eslint-disable no-unused-vars*/
var express = require('express');
var fs = require('fs');
var http = require('http'); 
    var request = require("request");
    var fetch = require("node-fetch");
var app = express();
var bodyParser = require('body-parser');
app.set('port', process.env.PORT || 3000);
/*set up STATIC file folder*/
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.get("/submit", function(httpRequest, httpResponse, next){

    var FormData = require("form-data");
    var form = new FormData();
    var CRLF = '\r\n';
    var opt = {
      header: CRLF + '--' + form.getBoundary() + CRLF + 'X-Custom-Header: 123' + CRLF + CRLF,
      knownLength: 1
    };
    form.append("json", '{"token":"884d20eb7ceb8e83f8ab7cb89fa238c0","type":"0","number":"0"}');
    // form.append("avatar", part, {filename: part.filename,contentType: part["content-type"]});
    form.append('avatar', fs.createReadStream(__dirname+'/gate.jpg')); //Put file
    // form.append('message', "Gaitooo"); //Put message
    var url1= "http://localhost:8080/";
    var url2= "http://218.244.147.240:80/uploadavatar";

    var options1 = {
        method: 'post',
        hostname: 'localhost',
        port:8080,
        path: '/uploadavatar',
        headers: form.getHeaders()
        // headers: { 'content-type': 'multipart/form-data;'+'--' + form.getBoundary() + CRLF + 'X-Custom-Header: 123' + CRLF + CRLF,
        //     'content-length': '12345000' }
    };    

    var options2 = {
        method: 'post',
        hostname: '218.244.147.240',
        port:80,
        path: '/uploadavatar',
        headers: form.getHeaders()
        // headers: { 'content-length': '0','content-type': 'multipart/form-data;'+'--' + form.getBoundary() + CRLF + 'X-Custom-Header: 123' + CRLF + CRLF
        //      }
    };
         // console.log(options);
form.submit('http://218.244.147.240:80/uploadavatar', function(err, res) {
  if (err) throw err;
  console.log(res.status);
  console.log('Done');
});
    // var request = http.request(options1, function (res){
    //      httpResponse.send(res.headers);
    //      console.log(res);
    // });

    // form.pipe(request);

    // request.on('error', function (error) {
    //      console.log(error);
    // });
    
    // fetch("http://localhost:8080/", { method: 'POST', body: form, headers: form.getHeaders() })
    // .then(function(res) {
    //      httpResponse.send(res.headers);
    // }).then(function(json) {
    //     console.log(json);
    // });
    });
/*Start up the App*/
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
