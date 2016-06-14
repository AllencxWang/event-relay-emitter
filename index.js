var EventEmitter = require('events');
var util = require('util');

function EventRelayEmitter() {
	EventEmitter.call(this);
};

util.inherits(EventRelayEmitter, EventEmitter);

EventRelayEmitter.prototype._relay = function(once, sourceEventName, target, targetEventName, parameters) {
	var self = this,
		args = Array.prototype.slice.call(arguments),
		relayHandler;

	if(!(target instanceof EventEmitter)) {
		throw new Error('target is not an instance of EventRelayEmitter/EventEmitter');
	}

	relayHandler = function() {
		// using parameters.slice() to get a clone, instead of modifying the original one
		args = util.isArray(parameters) ? parameters.slice() : Array.prototype.slice.call(arguments);
		targetEventName = targetEventName || sourceEventName;
		args.unshift(targetEventName);
		target.emit.apply(target, args);
		if(once) {
			self.removeListener(sourceEventName, relayHandler);
		}
	};
	
	return self.addListener(sourceEventName, relayHandler);
};

EventRelayEmitter.prototype.relay = function(sourceEventName, target, targetEventName, parameters) {
	return EventRelayEmitter.prototype._relay.call(this, false, sourceEventName, target, targetEventName, parameters);
};

EventRelayEmitter.prototype.relayOnce = function(sourceEventName, target, targetEventName, parameters) {
	return EventRelayEmitter.prototype._relay.call(this, true, sourceEventName, target, targetEventName, parameters);
};

module.exports = EventRelayEmitter;