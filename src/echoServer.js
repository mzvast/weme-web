/*eslint-env node*/
/*eslint-disable no-alert, no-console */
/*eslint-disable no-unused-vars*/
var http = require('http');
 
http.createServer(function(request,response){
 console.log(request.headers);
 response.writeHead(200);
 request.pipe(response);
 
}).listen(8888);