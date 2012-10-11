var http = require('http')
  , ServerSent = require('../lib')
  , tmpl, server, es, first

tmpl  = require('fs').readFileSync(__dirname + '/index.html', 'utf8')


server = http.createServer(function (req, res){
    res.setHeader('Content-Type','text/html')
	res.end(tmpl)
}).listen(8080, function(){
	console.log('Server on 8080')
})





es = new ServerSent(server, { heartbeat: 1000*5 })

first = es.of('/sse', { validate: function (req, next) {
	// validate Request, auth, params and whatnot
	next()
}})

first.on('connection', function (socket){
	console.log('SOCKET', first.members)
	socket.event('test')
	socket.end('bienvenido')
	socket.event('json')
	socket.json({
		time: +new Date
	})
	setInterval(function(){
		if (!socket._isClosed) {
			process.stdout.write('.')
			socket.event('test')
			socket.end('hola')
		}
	},1500)
})


module.exports = server