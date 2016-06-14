EventRelayEmitter
====================
---

This module is inspired by Qt C++ GUI Framework. In Qt, you can do things like this: connect( &obj1, SIGNAL( signal() ), &obj2, SIGNAL( signal() ) ). Once the signal from obj1 is emitted, the signal from obj2 will be emitted as well.

With JavaScript and Node.js, a simple event relay can be done as below:

```
var EventEmitter = require('events');
var aaa = new EventEmitter();
var bbb = new EventEmitter();
aaa.on('AAA', bbb.emit.bind(bbb, 'BBB');
aaaa.emit('AAA', param1, param2, ...);
```
Any event handler of bbb attached to the 'BBB' event will be triggered after the 'AAA' event from aaa was sent.

If that's all you need, you can skip the rest of this, but...
+ if you want to have different parameters to be passed into the relayed event handler
+ if you want the original event to be relayed only once

That's why EventRelayEmitter comes into play. I know this module name looks weird, I was thinking something like event-relay, but unfortunately it's been taken, so be it.

## Functions
##### EventRelayEmitter.relay(eventName, target [, targetEventName] [, parameters])
##### EventRelayEmitter.relayOnce(eventName, target [, targetEventName] [, parameters])
+ eventName (mandatory): <String> | <Symbol> The original event name.
+ target (mandatory): <EventRelayEmitter> | <EventEmitter> The target that you want the original event to be relayed to.
+ targetEventName (optional): <String> | <Symbol> The event name that you want the target to emit when the original event was invoked, if this is omitted, it will use the original event name instead.
+ parameters (optional): <Array> The parameters that will be passed into target event handler, if this is omitted, it will use the same one that the original event was invoked with.

There is no big difference between EventRelayEmitter.relay and EventRelayEmitter.relayOnce, but with EventRelayEmitter.relayOnce, once a event was relayed, the corresponding event handler will be removed. The idea comes from [here](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).
