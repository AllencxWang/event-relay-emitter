EventRelayEmitter
====================
---

This module is inspired by Qt C++ GUI Framework. In Qt, you can do things like this: connect( &obj1, SIGNAL( signal1() ), &obj2, SIGNAL( signal2() ) ). Once the signal1 from obj1 is emitted, the signal2 from obj2 will be emitted as well.

With JavaScript and Node.js, a simple event relay can be done as below:

```
var EventEmitter = require('events'),
    source = new EventEmitter(),
    target = new EventEmitter();

source.on('sourceEvent', target.emit.bind(target, 'targetEvent');
source.emit('event', param1, param2, ...);
```
While emitting the 'sourceEvent' from the source, any event handler on the target attached to the 'targetEvent' will also be invoked.

If that's all you need, you can skip the rest of this, but...
+ if you want a whole different parameters to be passed into the relayed event handler
+ if you want an event to be relayed only once

That's why EventRelayEmitter comes into play. I know this module name looks weird, I was thinking something like event-relay, but unfortunately it's been taken, so be it.

## Functions
##### EventRelayEmitter.relay(sourceEvent, target [, options])
##### EventRelayEmitter.relayOnce(sourceEvent, target [, options])
+ sourceEvent (mandatory): &lt;String&gt; | &lt;Symbol&gt; The source event name.
+ target (mandatory): &lt;EventRelayEmitter&gt; | &lt;EventEmitter&gt; The target that you want the source event to be relayed to.
+ options (optional): &lt;Object&gt;
  + targetEvent (optional): &lt;String&gt; | &lt;Symbol&gt; A new event name that you want the target to emit when the source event is invoked, if this value is omitted, it will use the source event name instead.
  + parameters (optional): &lt;Array&gt; The parameters that will be passed into target event handler, if this is omitted, it will use the same one that the source event is invoked with.

There is no big difference between EventRelayEmitter.relay and EventRelayEmitter.relayOnce, but, with EventRelayEmitter.relayOnce, once a event has been relayed, the corresponding event handler will be removed. The idea comes from [here](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).

## Usage
```
var EventRelayEmitter = require('EventRelayEmitter'),
	Allen = new EventRelayEmitter(),
	Richard = new EventRelayEmitter();

Allen.on('greetings', console.log.bind(null, 'Allen:'));
Allen.relay('greetings', Richard);
Richard.on('greetings', console.log.bind(null, 'Richard:'));
Allen.emit('greetings', 'Hi');
Allen.emit('greetings', 'Hello', 'World');

// [console]
// Allen: Hi
// Richard: Hi
// Allen: Hello World
// Richard: Hello World
```
As you can see, the 'greetings' event invoked from Allen is also relayed to Richard. Let's see how EventRelayEmitter.relayOnce works:

```
var EventRelayEmitter = require('EventRelayEmitter'),
	Allen = new EventRelayEmitter(),
	Richard = new EventRelayEmitter();

Allen.relayOnce('greetings', Richard);
Allen.on('greetings', console.log.bind(null, 'Allen:'));
Richard.on('greetings', console.log.bind(null, 'Richard:'));
Allen.emit('greetings', 'Hi');
Allen.emit('greetings', 'Hello', 'World');

// [console]
// Richard: Hi
// Allen: Hi
// Allen: Hello World
```
There are 2 difference between the first example and the second one
+ after swapping the order of Allen.relayOnce(...) and Allen.on(...), the output sequence on the console has changed. (Richard shown before Allen)
+ the 'greetings' event handler on Richard is not invoked on the second call to Allen.emit(...) 

Now you know the rule, let's see how options work:
```
var EventRelayEmitter = require('EventRelayEmitter'),
	Allen = new EventRelayEmitter(),
	Richard = new EventRelayEmitter(),
	Curtis = new EventRelayEmitter();

Allen.relayOnce('greetings', Richard, { parameters: ['Hello', 'World'] });
Allen.on('greetings', console.log.bind(null, 'Allen:'));
Allen.relayOnce('greetings', Curtis, { targetEvent: 'cheers', parameters: ['Yes', 'Baby'] });
Richard.on('greetings', console.log.bind(null, 'Richard:'));
Curtis.on('cheer', console.log.bind(null, 'Curtis:'));
Allen.emit('greetings', 'Hi');

// [console]
// Richard: Hello World
// Allen: Hi
// Curtis: Yes Baby
```
That's pretty much it, have fun!
