var siteconfig = {
	domain: '127.0.0.1',
	port: 3000,
}

var http 		= require('http')				//HTTP
var	url	 		= require('url')
var path 		= require('path')
var fs 			= require('fs')					//FILESYSTEM				
var util 		= require('util')

var mimeTypes = {		
    "html"	: "text/html",
    "jpeg"	: "image/jpeg",
    "jpg"	: "image/jpeg",
    "png"	: "image/png",
    "js"	: "text/javascript",
    "css"	: "text/css"
}

var arrow = http.createServer(function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd()+"/content", uri);

	if (uri == "/") {
			var page = path.join(process.cwd()+"/content", "/index.htm");			
			var mimeType = mimeTypes[path.extname(page).split(".")[1]]
			res.writeHead(200, {'Content-Type': mimeType})
			var fileStream = fs.createReadStream(page);
			fileStream.pipe(res);
			return;
	}
	

	//####################   STATIC FILES ################
	fs.exists(filename, function(exists) {
		if (!exists) {
			//console.log("404:"+filename);		
			res.writeHead(404, {'Content-Type': 'text/html'});
		  	res.write('error 404');
		  	res.end();
		  	return;
		} 

		var stats = fs.statSync(filename);
		//console.log("STATS: "+stats.isDirectory());

		if (stats.isDirectory()) {
			fs.readdir(filename, function(err, files){
				for (var a in files) {
					if (files[a] == "index.htm") {
						filename = path.join(filename, "index.htm")
						var mimeType = mimeTypes[path.extname(filename).split(".")[1]]
						res.writeHead(200, {'Content-Type': mimeType})
						var fileStream = fs.createReadStream(filename);
						fileStream.pipe(res);	
					}
				}
			})



		} else {
			var mimeType = mimeTypes[path.extname(filename).split(".")[1]]
			res.writeHead(200, {'Content-Type': mimeType})
			var fileStream = fs.createReadStream(filename);
			fileStream.pipe(res);	
		}		
	});	//end static server
	
})

/*
var io = require('socket.io').listen(arrow);
//animations > http://www.yearofmoo.com/2013/04/animation-in-angularjs.html


io.sockets.on('connection', function (socket) {
  socket.emit('news', { text:'socket.io', done:false });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('todo', function (data) {
    console.log(data);
  });  
});
*/

//START IT UP
console.log("Starting up server")
arrow.listen(siteconfig.port, siteconfig.domain);
if (siteconfig.domain == undefined) {
	console.log("Open your browser on localhost:"+siteconfig.port)
} else {
	console.log("Open your browser on " + siteconfig.domain + ":"+siteconfig.port)
}