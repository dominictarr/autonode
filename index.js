var net  = require('net')
var EventEmitter = require('events').EventEmitter

module.exports = autonode

function delay(fun) {
  return function () {
    var args = [].slice.call(arguments)
    setTimeout(function () {
       fun.apply(null, args)
    }, 50)
  }
}

function autonode (handler) {
  var emitter = new EventEmitter()
  var server, client, _port
  emitter.listen = 
    function listen (port) {
      //try and start a server on port.
      server = net.createServer(onConnect).listen(port || _port)
      server.once('error', function (err) {
        //someone else has already started server.
        //connect to it.
        if('EADDRINUSE' == err.code) {
          client = net.connect(port || _port)
            .once('connect', onConnect)
            .once('close', delay(listen))
        }
      })
      //remember the port for next time.
      _port = port
      return this
    }

  function onConnect (stream) {
    emitter.emit('connection', stream || client)
  }
  if(handler) emitter.on('connection', handler)
  return emitter
}

