This module is inspired by Qt C++ GUI Framework.

In Qt, you can do things like this: connect( &obj1, SIGNAL( signal() ), &obj2, SIGNAL( signal() ) );

Once the signal from obj1 is emitted, the signal from obj2 will be emitted as well.

With JavaScript and Node.js, a simple event relay can be done like this:

var EventEmitter = require('events');

var a = new EventEmitter();
var b = new EventEmitter();

a.on('AAA', b.emit.bind(b, 'BBB')

a.emit('AAA', param1, param2, ...);

Any event handler of b attached to the 'BBB' event will be triggered after that.




