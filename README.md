# autonode

Create a node that starts a tcp server on a port,
but if the address is in use, connect to that port instead.

Also, if the current server goes down, 
another node will become the server.

>NOTE: this only works for a cluster on a single machine.

## Example

This is the code for both the _server_ and the _client_.

``` js
var autonode = require('autonode')

autonode(function (stream) {
  // called when a connection is made, whether
  // this node turns out to be the client or the server.
}).listen(PORT)
```

Naturally you will need to use a decentralized communication protocol.
checkout [crdt](https://github.com/dominictarr/crdt) 
or [scuttlebutt](https://github.com/dominictarr/scuttlebutt)

## License

MIT
