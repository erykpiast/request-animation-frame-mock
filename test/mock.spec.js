/* global jasmine, describe, it, expect, beforeEach, afterEach, spyOn */

var proxyquire = require('proxyquireify')(require);

var queueMock = {
    splice: jasmine.createSpy('queue.splice'),
    push: jasmine.createSpy('queue.push'),
    indexOf: jasmine.createSpy('queue.indexOf').and.returnValue(0)
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
    
    
    it('Should return unsigned integer', function() {
        expect(id).toBeDefined();
        expect(typeof id).toBe('number');
        expect(id).toBeGreaterThan(0);
        expect(id).toEqual(Math.abs(id));
    });
    
    
    it('Should return different id each time its called', function() {
        var ids = [ ];
        for(var i = 0; i < 100; i++) {
            ids.push(mock.requestAnimationFrame(frameDrawer));
        }
        
        ids.forEach(function(id, index) {
            expect(ids.indexOf(id)).toBe(index);
        });
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
        
        queueMock.splice.calls.reset();
    });
    
    
    it('Should splice request from to the queue', function() {
        expect(queueMock.splice).toHaveBeenCalled();
        expect(queueMock.splice.calls.count()).toBe(1);
        expect(queueMock.splice.calls.argsFor(0)).toEqual([ 0, 1 ]);
    });

});