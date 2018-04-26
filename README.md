event-relay-emitter
====================
---
[![Build Status](https://travis-ci.org/AllencxWang/event-relay-emitter.svg?branch=master)](https://travis-ci.org/AllencxWang/event-relay-emitter)
---
## Installation
```
$ npm install event-relay-emitter
```
## Background
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
var EventRelayEmitter = require('event-relay-emitter'),
    allen = new EventRelayEmitter(),
    richard = new EventRelayEmitter();

allen.on('greetings', console.log.bind(null, 'allen:'));
allen.relay('greetings', richard);
richard.on('greetings', console.log.bind(null, 'richard:'));
allen.emit('greetings', 'hey');
allen.emit('greetings', 'hello', 'world');

// [console]
// allen: hey
// richard: hey
// allen: hello world
// richard: hello world
```
As you can see, the 'greetings' event invoked from allen is also relayed to richard. Let's see how EventRelayEmitter.relayOnce works:

```
var EventRelayEmitter = require('event-relay-emitter'),
    allen = new EventRelayEmitter(),
    richard = new EventRelayEmitter();

allen.relayOnce('greetings', richard);
allen.on('greetings', console.log.bind(null, 'allen:'));
richard.on('greetings', console.log.bind(null, 'richard:'));
allen.emit('greetings', 'hey');
allen.emit('greetings', 'hello', 'world');

// [console]
// richard: hey
// allen: hey
// allen: hello world
```
There are 2 difference between the first example and the second one
+ after swapping the order of allen.relayOnce(...) and allen.on(...), the output sequence on the console has changed. (richard shown before allen)
+ the 'greetings' event handler on richard is not invoked on the second call to allen.emit(...) 

Now you know the rule, let's see how options work:
```
var EventRelayEmitter = require('event-relay-emitter'),
    allen = new EventRelayEmitter(),
    richard = new EventRelayEmitter(),
    curtis = new EventRelayEmitter();

allen.relayOnce('greetings', richard, { parameters: ['hello', 'world'] });
allen.on('greetings', console.log.bind(null, 'allen:'));
allen.relayOnce('greetings', curtis, { targetEvent: 'cheers', parameters: ['yes', 'baby'] });
richard.on('greetings', console.log.bind(null, 'richard:'));
curtis.on('cheers', console.log.bind(null, 'curtis:'));
allen.emit('greetings', 'hey');

// [console]
// richard: hello world
// allen: hey
// curtis: yes baby
```

You see, the 'greetings' event came from allen has been redirected to curtis's 'cheers' event handler, also, as richard's 'greetings' event handler been triggered, the corresponding parameters was switched to 'hello' and 'world'.

That's pretty much it, have fun!
