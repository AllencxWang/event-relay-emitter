var EventRelayEmitter = require('../index.js');

describe("A test suite for EventRelayEmitter", function() {

    beforeEach(function() {
        this.source = new EventRelayEmitter();
        this.target = new EventRelayEmitter();
    });

    afterEach(function() {
        delete this.source;
        delete this.target;
    });

    it("should trigger the corresponding event handlers every time the event from the source is emitted", function() {
        var sourceHandler = jasmine.createSpy('sourceHandler'),
            targetHandler = jasmine.createSpy('targetHandler');

        this.source.relay('test', this.target);
        this.source.on('test', sourceHandler);
        this.target.on('test', targetHandler);

        this.source.emit('test', true, 123, 'hello');

        expect(sourceHandler).toHaveBeenCalledWith(true, 123, 'hello');
        expect(targetHandler).toHaveBeenCalledWith(true, 123, 'hello');

        this.source.emit('test', 'world', [false, 777]);

        expect(sourceHandler).toHaveBeenCalledWith('world', [false, 777]);
        expect(targetHandler).toHaveBeenCalledWith('world', [false, 777]);
    });

    it("should trigger the corresponding event handlers in the order of their register time", function() {
        var testHandler = jasmine.createSpy('testHandler'),
            demoHandler = jasmine.createSpy('demoHandler');

        this.source.relay('test', this.target);
        this.source.on('test', testHandler);
        this.target.on('test', testHandler);

        this.source.emit('test');

        expect(testHandler.calls.first().object).toBe(this.target);
        expect(testHandler.calls.mostRecent().object).toBe(this.source);

        this.source.on('demo', demoHandler);
        this.source.relay('demo', this.target);
        this.target.on('demo', demoHandler);

        this.source.emit('demo');

        expect(demoHandler.calls.first().object).toBe(this.source);
        expect(demoHandler.calls.mostRecent().object).toBe(this.target);
    });

    it("should only relay once using EventRelayEmitter.relayOnce function", function() {
        var testHandler = jasmine.createSpy('testHandler');

        this.source.relayOnce('test', this.target);
        this.target.on('test', testHandler);

        this.source.emit('test');
        this.source.emit('test');
        this.source.emit('test');

        expect(testHandler.calls.count()).toEqual(1);
    });

    it("should redirect to the designated event when the options.targetEvent is specified", function() {
        var demoHandler = jasmine.createSpy('demoHandler');

        this.source.relayOnce('test', this.target, { targetEvent: 'demo' });
        this.target.on('demo', demoHandler);

        this.source.emit('test');
        
        expect(demoHandler).toHaveBeenCalled();
    });

    it("should trigger event handler with the designated parameters when the options.parameters is specified", function() {
        var testHandler = jasmine.createSpy('testHandler');

        this.source.relayOnce('test', this.target, { parameters: ['lucky', 7] });
        this.target.on('test', testHandler);

        this.source.emit('test', 'hello', 'world');

        expect(testHandler).toHaveBeenCalledWith('lucky', 7);
    });

});