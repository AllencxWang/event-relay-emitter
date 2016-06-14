var EventEmitter = require('events');
var util = require('util');

function EventRelayEmitter() {
	EventEmitter.call(this);
};

util.inherits(EventRelayEmitter, EventEmitter);

EventRelayEmitter.prototype._relay = function(once, eventName, targetObject, targetEvent, parameters) {
	this.relayMaps = this.relayMaps || {};
	this.relayMaps[eventName] = this.relayMaps[eventName] || [];
	this.relayMaps[eventName].push({
		once: once,
		targetObject: targetObject,
		targetEvent: targetEvent,
		parameters: parameters
	});
};

EventRelayEmitter.prototype.relay = function(eventName, targetObject, targetEvent, parameters) {
	EventRelayEmitter.prototype._relay.call(this, false, eventName, targetObject, targetEvent, parameters);
};

EventRelayEmitter.prototype.relayOnce = function(eventName, targetObject, targetEvent, parameters) {
	EventRelayEmitter.prototype._relay.call(this, true, eventName, targetObject, targetEvent, parameters);
};

EventRelayEmitter.prototype.emit = function() {
	var args = Array.prototype.slice.call(arguments);
	var eventName = args[0];
	
	EventEmitter.prototype.emit.apply(this, args);

	if( util.isArray(this.relayMaps[eventName]) ) {
		this.relayMaps[eventName].forEach(function(e) {
			util.isArray(e.parameters) ? e.parameters.unshift(e.targetEvent) : e.parameters = [e.targetEvent];
			e.targetObject.emit.apply(e.targetObject, e.parameters);
		});
	}
};

module.exports = EventRelayEmitter;