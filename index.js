var EventEmitter = require('events'),
    util = require('util');

function EventRelayEmitter() {
    if (!(this instanceof EventRelayEmitter)) {
        return new EventRelayEmitter();
    }
    EventEmitter.call(this);
};

util.inherits(EventRelayEmitter, EventEmitter);

EventRelayEmitter.prototype._relay = function(once, sourceEvent, target, options) {
    var self = this,
        args = Array.prototype.slice.call(arguments),
        relayHandler;

    if (!(target instanceof EventEmitter)) {
        throw new TypeError('target must be an EventRelayEmitter or EventEmitter');
    }

    relayHandler = function() {
        options = options || {};
        // using parameters.slice() to get a clone, instead of modifying the original one
        args = util.isArray(options.parameters) ? options.parameters.slice() : Array.prototype.slice.call(arguments);
        args.unshift(options.targetEvent || sourceEvent);
        target.emit.apply(target, args);
        if (once) {
            self.removeListener(sourceEvent, relayHandler);
        }
    };

    return self.addListener(sourceEvent, relayHandler);
};

EventRelayEmitter.prototype.relay = function(sourceEvent, target, options) {
    return EventRelayEmitter.prototype._relay.call(this, false, sourceEvent, target, options);
};

EventRelayEmitter.prototype.relayOnce = function(sourceEvent, target, options) {
    return EventRelayEmitter.prototype._relay.call(this, true, sourceEvent, target, options);
};

module.exports = EventRelayEmitter;