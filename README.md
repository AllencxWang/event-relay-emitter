EventRelayEmitter
====================
---

This module is inspired by Qt C++ GUI Framework. In Qt, you can do things like this: connect( &obj1, SIGNAL( signal1() ), &obj2, SIGNAL( signal2() ) ). Once the signal1 from obj1 is emitted, the signal2 from obj2 will be emitted as well.

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
##### EventRelayEmitter.relay(eventName, target [, options])
##### EventRelayEmitter.relayOnce(eventName, target [, options])
+ eventName (mandatory): <String> | <Symbol> The original event name.
+ target (mandatory): <EventRelayEmitter> | <EventEmitter> The target that you want the original event to be relayed to.
+ options (optional): <Object>
  + targetEventName (optional): <String> | <Symbol> The event name that you want the target to emit when the original event was invoked, if this is omitted, it will use the original event name instead.
  + parameters (optional): <Array> The parameters that will be passed into target event handler, if this is omitted, it will use the same one that the original event was invoked with.

There is no big difference between EventRelayEmitter.relay and EventRelayEmitter.relayOnce, but with EventRelayEmitter.relayOnce, once a event was relayed, the corresponding event handler will be removed. The idea comes from [here](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).

## Usage
```
01)    var EventRelayEmitter = require('EventRelayEmitter'),
02)	       Allen = new EventRelayEmitter(),
03)	       Richard = new EventRelayEmitter();
04)
05)    Allen.on('greeting', console.log.bind(null, 'Allen:'));
06)    Allen.relay('greeting', Richard);
07)    Richard.on('greeting', console.log.bind(null, 'Richard:'));
08)    Allen.emit('greeting', 'Hi');
09)    Allen.emit('greeting', 'Hello', 'World');

// [console]
// Allen: Hi
// Richard: Hi
// Allen: Hello World
// Richard: Hello World
```
As you can see, the 'greeting' event invoked from Allen is relayed to Richard. Let's see how EventRelayEmitter.relayOnce does:

```
01)    var EventRelayEmitter = require('EventRelayEmitter'),
02)	       Allen = new EventRelayEmitter(),
03)	       Richard = new EventRelayEmitter();
04)
05)    Allen.relayOnce('greeting', Richard);
06)    Allen.on('greeting', console.log.bind(null, 'Allen:'));
07)    Richard.on('greeting', console.log.bind(null, 'Richard:'));
08)    Allen.emit('greeting', 'Hi');
09)    Allen.emit('greeting', 'Hello', 'World');

// [console]
// Richard: Hi
// Allen: Hi
// Allen: Hello World
```
There are 2 difference between the first example and the second one
+ after swapping line#5 with line#6, the output sequence on the console has changed. (Richard shown before Allen)
+ the 'greeting' event handler of Richard is not triggered on the second Allen.emit() 

Now you know the rule, let's see how options work:
```
01)    var EventRelayEmitter = require('EventRelayEmitter'),
02)        Allen = new EventRelayEmitter(),
03)        Richard = new EventRelayEmitter(),
04)        Curtis = new EventRelayEmitter();
05)
06)    Allen.relayOnce('greeting', Richard, { parameters: ['Hello', 'World'] });
07)    Allen.on('greeting', console.log.bind(null, 'Allen:'));
08)    Allen.relayOnce('greeting', Curtis, { targetEventName: 'cheer', parameters: ['Yes', 'Baby'] });
09)    Richard.on('greeting', console.log.bind(null, 'Richard:'));
10)    Curtis.on('cheer', console.log.bind(null, 'Curtis:'));
11)    Allen.emit('greeting', 'Hi');

// [console]
// Richard: Hello World
// Allen: Hi
// Curtis: Yes Baby
```
I bet you've got the idea, go out and play with it now!
