# autonode

Connect a cluster on a single machine.
One node starts a server on a given port,
but if the address is in use, become a client, 
and connect to that port instead.

Also, if the current server goes down, 
another node will become the server.

If running in the browser, [tab-stream](https://github.com/dominictarr/tab-stream)
is used instead of net.

## Example

This is the code for both the _server_ and the _client_.

``` js
var autonode = require('autonode')

autonode(function (stream) {
  // called when a connection is made, whether
  // this node turns out to be the client or the server.
  if(this.isServer) 
    console.log('we are the server')
  if(this.isClient)
    console.log('we are the client')

}).listen(PORT)
```

Naturally you will want to use a decentralized communication protocol.
checkout [crdt](https://github.com/dominictarr/crdt) 
or [scuttlebutt](https://github.com/dominictarr/scuttlebutt)

## License

MIT
