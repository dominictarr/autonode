
var assert = require('assert')
var autonode = require('./')

var port = ~~(Math.random() * 30000) + 1025

autonode(function (stream) {
  console.log(this.isServer)
  assert.ok(this.isServer, 'server.isServer')
  assert.ok(!this.isClient, '!server.isClient')
  stream.end()
  this.close()
}).listen(port)
.on('listening', function () {
  autonode(function (stream) {
    console.log(this)
    assert.ok(this.isClient, 'client.isClient')
    assert.ok(!this.isServer, '!client.isServer')
    stream.end()
    this.close()
  }).listen(port)
})
