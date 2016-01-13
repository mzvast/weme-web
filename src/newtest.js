/*eslint-env node*/
/*eslint-disable no-alert, no-console */
/*eslint-disable no-unused-vars*/
var http = require('http'); //Https module of Node.js
var fs = require('fs'); //FileSystem module of Node.js
var FormData = require('form-data'); //Pretty multipart form maker.
 
 
var form = new FormData(); //Create multipart form
form.append('file', fs.createReadStream(__dirname+'/seulogo.jpg')); //Put file
form.append('message', "Gaitooo"); //Put message
 
//POST request options, notice 'path' has access_token parameter
var options = {
    method: 'post',
    host: 'localhost',
    port:8080,
    path: '/',
    headers: form.getHeaders()
};
 
//Do POST request, callback for response
var request = http.request(options, function (res){
     console.log(res);
});
 
//Binds form to request
form.pipe(request);
 
//If anything goes wrong (request-wise not FB)
request.on('error', function (error) {
     console.log(error);
});