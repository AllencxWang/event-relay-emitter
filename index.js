var EventEmitter = require('events');
var util = require('util');

function EventRelayEmitter() {
	EventEmitter.call(this);
};

util.inherits(EventRelayEmitter, EventEmitter);

EventRelayEmitter.prototype._relay = function(once, eventName, target, targetEventName) {
	var self = this,
		args = Array.prototype.slice.call(arguments),
		relayHandler;

	if(!(target instanceof EventEmitter)) {
		throw new Error('target is not an instance of EventEmitter');
	}

	relayHandler = function() {
		args = Array.prototype.slice.call(arguments);
		args.unshift(targetEventName);
		target.emit.apply(target, args);
		if(once) {
			self.removeListener(eventName, relayHandler);
		}
	};
	
	return self.addListener(eventName, relayHandler);
};

EventRelayEmitter.prototype.relay = function(eventName, target, targetEventName) {
	return EventRelayEmitter.prototype._relay.call(this, false, eventName, target, targetEventName);
};

EventRelayEmitter.prototype.relayOnce = function(eventName, target, targetEventName) {
	return EventRelayEmitter.prototype._relay.call(this, true, eventName, target, targetEventName);
};

module.exports = EventRelayEmitter;