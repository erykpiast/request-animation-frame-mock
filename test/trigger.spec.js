/* global jasmine, describe, it, expect, beforeEach, afterEach, spyOn */

var proxyquire = require('proxyquireify')(require);

var trigger = proxyquire('../lib/trigger', { });


describe('trigger object test', function() {

    it('Should be an object with functions', function() {
        expect(typeof trigger).toBe('object');
        expect(typeof trigger.getQueue).toBe('function');
        expect(typeof trigger.setMode).toBe('function');
        expect(typeof trigger.trigger).toBe('function');
    });
    
    it('Should have modes property with three modes', function() {
        expect(typeof trigger.modes).toBe('object');
        expect(typeof trigger.modes.MANUAL).toBeDefined();
        expect(typeof trigger.modes.INTERVAL).toBeDefined();
        expect(typeof trigger.modes.PROXY_PASS).toBeDefined();
    });

});


describe('trigger getQueue function test', function() {
    var queue;
    
    beforeEach(function() {
        queue = trigger.getQueue();
    });
    
    afterEach(function() {
        queue = null;
    });
    
    
    it('Should return the same queue each time it is called', function() {
        for(var i = 0; i < 100; i++) {
            expect(trigger.getQueue()).toBe(queue);
        }
    });
    
    it('Should queue has a few methods', function() {
        expect(typeof queue.push).toBe('function');
        expect(typeof queue.splice).toBe('function');
        expect(typeof queue.indexOf).toBe('function');
    });

});


describe('trigger setMode function test', function() {
    
    it('Should throw if mode not from modes object is passed', function() {
        expect(function() {
            trigger.setMode('');
        }).toThrow();
        
        expect(function() {
            trigger.setMode(9);
        }).toThrow();
    });
    
    it('Should not throw if mode from modes object or equivalent is passed', function() {
        expect(function() {
            trigger.setMode(trigger.modes.MANUAL);
        }).not.toThrow();
        
        expect(function() {
            trigger.setMode(trigger.modes.INTERVAL, {
                setInterval: jasmine.createSpy('setInterval'),
                clearInterval: jasmine.createSpy('clearInterval'),
                time: 1,
                timeFn: jasmine.createSpy('timeFn')
            });
        }).not.toThrow();
        
        expect(function() {
            trigger.setMode(trigger.modes.PROXY_PASS, {
                requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
                cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame')
            });
        }).not.toThrow();
    });

});


describe('trigger setMode:manual function test', function() {
    
    it('Should cancel all request made before when calling the method', function() {
        var clearInterval = jasmine.createSpy('clearInterval');
        var cancelAnimationFrame = jasmine.createSpy('cancelAnimationFrame');
        
        trigger.setMode(trigger.modes.INTERVAL, {
            setInterval: jasmine.createSpy('setInterval'),
            clearInterval: clearInterval,
            time: 1,
            timeFn: jasmine.createSpy('timeFn')
        });
        
        trigger.setMode(trigger.modes.MANUAL);
        
        expect(clearInterval).toHaveBeenCalled();
        
        
        trigger.setMode(trigger.modes.PROXY_PASS, {
            requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
            cancelAnimationFrame: cancelAnimationFrame
        });
        
        trigger.setMode(trigger.modes.MANUAL);
        
        expect(cancelAnimationFrame).toHaveBeenCalled();
    });
    
    it('Should allow to call a trigger method after setting the mode', function() {
        trigger.setMode(trigger.modes.MANUAL);
        
        expect(function() {
            trigger.trigger(1000);
        }).not.toThrow();
    });

});


describe('trigger setMode:interval function test', function() {
    
    beforeEach(function() {
        trigger.setMode(trigger.modes.MANUAL);
    });
    
    
    it('Should cancel all request made before when calling the method', function() {
        var cancelAnimationFrame = jasmine.createSpy('cancelAnimationFrame');
        
        trigger.setMode(trigger.modes.PROXY_PASS, {
            requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
            cancelAnimationFrame: cancelAnimationFrame
        });
        
        trigger.setMode(trigger.modes.INTERVAL, {
            setInterval: jasmine.createSpy('setInterval'),
            clearInterval: jasmine.createSpy('clearInterval'),
            time: 1,
            timeFn: jasmine.createSpy('timeFn')
        });
        
        expect(cancelAnimationFrame).toHaveBeenCalled();
    });
    
    it('Should not allow to call a trigger method after setting the mode', function() {
        trigger.setMode(trigger.modes.INTERVAL, {
            setInterval: jasmine.createSpy('setInterval'),
            clearInterval: jasmine.createSpy('clearInterval'),
            time: 1,
            timeFn: jasmine.createSpy('timeFn')
        });
        
        expect(function() {
            trigger.trigger(1000);
        }).toThrow();
    });
    
    it('Should throw is configuration object is missing or it has wrong format', function() {
        expect(function () {
            trigger.setMode(trigger.modes.INTERVAL);
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.INTERVAL, {
                setInterval: jasmine.createSpy('setInterval'),
                clearInterval: jasmine.createSpy('clearInterval'),
                time: 1
            });
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.INTERVAL, {
                setInterval: jasmine.createSpy('setInterval'),
                clearInterval: jasmine.createSpy('clearInterval'),
                timeFn: jasmine.createSpy('timeFn')
            });
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.INTERVAL, {
                setInterval: jasmine.createSpy('setInterval'),
                time: 1,
                timeFn: jasmine.createSpy('timeFn')
            });
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.INTERVAL, {
                clearInterval: jasmine.createSpy('clearInterval'),
                time: 1,
                timeFn: jasmine.createSpy('timeFn')
            });
        }).toThrow();
    });

});


describe('trigger setMode:proxy_pass function test', function() {
    
    beforeEach(function() {
        trigger.setMode(trigger.modes.MANUAL);
    });
    
    
    it('Should cancel all request made before when calling the method', function() {
        var clearInterval = jasmine.createSpy('clearInterval');
        
        trigger.setMode(trigger.modes.INTERVAL, {
            setInterval: jasmine.createSpy('setInterval'),
            clearInterval: clearInterval,
            time: 1,
            timeFn: jasmine.createSpy('timeFn')
        });
        
        trigger.setMode(trigger.modes.PROXY_PASS, {
            requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
            cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame')
        });
        
        expect(clearInterval).toHaveBeenCalled();
    });
    
    it('Should not allow to call a trigger method after setting the mode', function() {
        trigger.setMode(trigger.modes.PROXY_PASS, {
            requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
            cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame')
        });
        
        expect(function() {
            trigger.trigger(1000);
        }).toThrow();
    });
    
    it('Should throw is configuration object is missing or it has wrong format', function() {
        expect(function () {
            trigger.setMode(trigger.modes.PROXY_PASS);
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.PROXY_PASS, {
                requestAnimationFrame: jasmine.createSpy('requestAnimationFrame')
            });
        }).toThrow();
        
        expect(function () {
            trigger.setMode(trigger.modes.PROXY_PASS, {
                cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame')
            });
        }).toThrow();
    });

});


describe('trigger trigger function test', function() {
    var frameDrawer1;
    var frameDrawer2;
    var queue = trigger.getQueue();
    
    beforeEach(function(done) {
        frameDrawer1 = jasmine.createSpy('frameDrawer1');
        frameDrawer2 = jasmine.createSpy('frameDrawer2');
        
        queue.push(frameDrawer1);
        
        setTimeout(function() {
            queue.push(frameDrawer2);
            
            done();
        }, 10);
        
        trigger.setMode(trigger.modes.MANUAL);
    });
    
    afterEach(function() {
        frameDrawer1 = null;
        frameDrawer2 = null;
        
        queue.splice(0, queue.length);
    });
    
    
    it('Should flush the queue of frame requests', function() {
        trigger.trigger(10);
        
        expect(frameDrawer1).toHaveBeenCalled();
        expect(frameDrawer2).toHaveBeenCalled();
    });
    
    it('Should call requestAnimationFrame callbacks with passed time', function() {
        var passedTime = 10;
        
        trigger.trigger(passedTime);
        
        expect(frameDrawer1.calls.argsFor(0)[0]).toBe(passedTime);
        expect(frameDrawer2.calls.argsFor(0)[0]).toBe(passedTime);
    });
    
    
    it('Should throw if mode is not manual', function() {
        trigger.setMode(trigger.modes.PROXY_PASS, {
            requestAnimationFrame: jasmine.createSpy('requestAnimationFrame'),
            cancelAnimationFrame: jasmine.createSpy('cancelAnimationFrame')
        });
        
        expect(function () {
            trigger.trigger(10);
        }).toThrow();
    });
    
    it('Should throw if the first parameter is not a number', function() {
        expect(function () {
            trigger.trigger();
        }).toThrow();
        
        expect(function () {
            trigger.trigger('');
        }).toThrow();
        
        expect(function () {
            trigger.trigger(function() { });
        }).toThrow();
        
        expect(function () {
            trigger.trigger({ });
        }).toThrow();
        
        expect(function () {
            trigger.trigger(NaN);
        }).toThrow();
    });

});