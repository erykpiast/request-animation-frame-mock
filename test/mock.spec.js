/* global jasmine, describe, it, expect, beforeEach, afterEach */

var proxyquire = require('proxyquireify')(require);

var queueMock = {
    push: jasmine.createSpy('queue.push').and.returnValue(1),
    pop: jasmine.createSpy('queue.pop'),
    clear: jasmine.createSpy('queue.clear')
};
var triggerMock = {
    getQueue: jasmine.createSpy('trigger.getQueue').and.returnValue(queueMock)
};

var mock = proxyquire('../lib/mock', {
    './trigger': triggerMock
});


describe('mock object test', function() {

    it('Should be an object with two functions', function() {
        expect(typeof mock).toBe('object');
        expect(typeof mock.requestAnimationFrame).toBe('function');
        expect(typeof mock.cancelAnimationFrame).toBe('function');
    });
    
    it('Should get a queue from the trigger', function() {
       expect(triggerMock.getQueue).toHaveBeenCalled();
    });

});


describe('mock.requestAnimationFrame function test', function() {
    var id;
    var frameDrawer;
    
    beforeEach(function() {
        id = mock.requestAnimationFrame(frameDrawer = jasmine.createSpy('frameDrawer'));
    });
    
    afterEach(function() {
        id = null;
        frameDrawer = null;
        
        queueMock.push.calls.reset();
    });
    
    
    it('Should throw if the first parameter is not a function', function() {
        expect(function () {
            mock.requestAnimationFrame();
        }).toThrow();
        
        expect(function () {
            mock.requestAnimationFrame(null);
        }).toThrow();
        
        expect(function () {
            mock.requestAnimationFrame('');
        }).toThrow();
        
        expect(function () {
            mock.requestAnimationFrame(4);
        }).toThrow();
        
        expect(function () {
            mock.requestAnimationFrame({});
        }).toThrow();
        
        expect(function () {
            mock.requestAnimationFrame(NaN);
        }).toThrow();
    });
    
    
    it('Should push request to the queue', function() {
        expect(queueMock.push).toHaveBeenCalled();
        expect(queueMock.push.calls.count()).toBe(1);
        expect(queueMock.push.calls.argsFor(0)[0]).toEqual(frameDrawer);
    });
    
    
    it('Should return value returned by queue.push', function() {
        expect(id).toBe(1);
    });
    
    
    it('Should not fire the callback', function() {
        expect(frameDrawer).not.toHaveBeenCalled();
    });

});


describe('mock.cancelAnimationFrame function test', function() {
    var id;
    var frameDrawer;
    
    beforeEach(function() {
        id = mock.requestAnimationFrame(frameDrawer = jasmine.createSpy('frameDrawer'));
        mock.cancelAnimationFrame(id);
    });
    
    afterEach(function() {
        id = null;
        frameDrawer = null;
        
        queueMock.pop.calls.reset();
    });
    
    
    it('Should splice request from to the queue', function() {
        expect(queueMock.pop).toHaveBeenCalled();
        expect(queueMock.pop.calls.count()).toBe(1);
        expect(queueMock.pop.calls.argsFor(0)[0]).toEqual(id);
    });

});