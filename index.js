var net  = process.title === 'browser' ? require('tab-stream') : (require)('net')
var EventEmitter = require('events').EventEmitter

module.exports = inject(net)

function inject (net) {

  function autonode (handler) {

    var emitter = new EventEmitter()
    var server, client, _port
    emitter.listen = 
      function listen (port) {
        //try and start a server on port.
        emitter.isServer = true
        emitter.isClient = false
        server = net.createServer(onConnect).listen(port || _port)
        server.once('error', function (err) {
          //someone else has already started server.
          //connect to it.
          if('EADDRINUSE' == err.code) {
            function reconnect () {
              client.removeListener('error', reconnect)
              client.removeListener('close', reconnect)
              client.removeListener('end',   reconnect)
              emitter.emit('connecting')
              setTimeout(listen, 50)
            }
            client = net.connect(port || _port)
              .once('connect', onConnect)
              .once('error',   reconnect)
              .once('end',     reconnect)
              .once('close',   reconnect)
          }
        })
        server.once('listening', function () {
          emitter.emit('listening')
        })
        //remember the port for next time.
        _port = port || _port
        return this
      }

    function onConnect (stream) {
      emitter.isServer = false
      emitter.isClient = true
      //'connection', stream, isServer
      emitter.emit('connection', stream || client, stream ? true : false)
    }
    if(handler) emitter.on('connection', handler)
    return emitter
  }

  autonode.inject = inject
  return autonode
}
