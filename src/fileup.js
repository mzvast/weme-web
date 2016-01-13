/*eslint-env node*/
/*eslint-disable no-alert, no-console */
/*eslint-disable no-unused-vars*/
var express = require('express');
var fs = require('fs');
// var http = require('http'); 
    var request = require("request");
    var multiparty = require("multiparty");
var app = express();
var bodyParser = require('body-parser');
app.set('port', process.env.PORT || 3000);
/*set up STATIC file folder*/
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.post("/submit", function(httpRequest, httpResponse, next){

    var form = new multiparty.Form();

    form.on("part", function(part){
        if(part.filename)
        {
            var filename = part.filename;
            var size = part.byteCount;

            var r = request.post('http://218.244.147.240:80/uploadavatar',function(err, res, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              console.log('Upload successful!  Server responded with:', body);
              httpResponse.send(body);
            });

            var form = r.form();

            form.append('json', '{"token":"884d20eb7ceb8e83f8ab7cb89fa238c0","type":"0","number":"0"}');
            form.append('avatar',part,{
                                          filename: part.filename,
                                          contentType: part.headers['content-type'],
                                          knownLength: part.byteCount
                                        });
        }
    });

    form.on("error", function(error){
        console.log(error);
    });

    form.parse(httpRequest);    
    
});

app.get("/", function(httpRequest, httpResponse, next){ 
    httpResponse.send("<form action='/submit' method='post' enctype='multipart/form-data'><input type='file' name='avatar' /><input type='submit' value='Submit' /></form>");
});
/*Start up the App*/
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});