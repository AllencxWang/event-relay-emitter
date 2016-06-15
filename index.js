var EventEmitter = require('events');
var util = require('util');

function EventRelayEmitter() {
    EventEmitter.call(this);
};

util.inherits(EventRelayEmitter, EventEmitter);

EventRelayEmitter.prototype._relay = function(once, sourceEventName, target, options) {
    var self = this,
        args = Array.prototype.slice.call(arguments),
        relayHandler;

    if(!(target instanceof EventEmitter)) {
        throw new Error('target is not an instance of EventRelayEmitter/EventEmitter');
    }

    relayHandler = function() {
        options = options || {};
        // using parameters.slice() to get a clone, instead of modifying the original one
        args = util.isArray(options.parameters) ? options.parameters.slice() : Array.prototype.slice.call(arguments);
        args.unshift(options.targetEventName || sourceEventName);
        target.emit.apply(target, args);
        if(once) {
            self.removeListener(sourceEventName, relayHandler);
        }
    };
    
    return self.addListener(sourceEventName, relayHandler);
};

EventRelayEmitter.prototype.relay = function(sourceEventName, target, options) {
    return EventRelayEmitter.prototype._relay.call(this, false, sourceEventName, target, options);
};

EventRelayEmitter.prototype.relayOnce = function(sourceEventName, target, options) {
    return EventRelayEmitter.prototype._relay.call(this, true, sourceEventName, target, options);
};

module.exports = EventRelayEmitter;