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
              emitter.isServer = false
              emitter.isClient = true


            function reconnect () {
              client.removeListener('error', reconnect)
              client.removeListener('close', reconnect)
              client.removeListener('end',   reconnect)
              setTimeout(listen, 50)
            }

            client = net.connect(port || _port)
              .once('connect', onConnect)
              .once('error',   reconnect)
              .once('end',     reconnect)
              .once('close',   reconnect)

            emitter.emit('connecting')
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
      //'connection', stream, isServer
      emitter.emit('connection', stream || client, stream ? true : false)
    }
    if(handler) emitter.on('connection', handler)

    emitter.close = function () {
      if(this.isServer)
        server.close()
      else {
        client.end()
        client.removeAllListeners()
      }
    }
    return emitter
  }

  autonode.inject = inject
  return autonode
}
