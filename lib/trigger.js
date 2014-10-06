module.exports = (function() {

    var Queue = require('./queue');

    var id = 1;
    var queue = new Queue(function _getUniqueId() {
        return id++;
    });
    
    var modes = {
        MANUAL: 1,
        INTERVAL: 2,
        PROXY_PASS: 3
    };
    var mode = modes.MANUAL;
    var params = { };
    var requestedAnimationFrame;
    var frameCount = 0;
    var previousTime = 0;
    var lastFullfilledRequestId = id;
    
    
    function _rethrow(err) {
        process.nextTick(function() {
            throw err;
        });
    }
    
    
    function _trigger(time) {
        frameCount++;
        previousTime = time;
        
        for (var i = lastFullfilledRequestId, maxi = id, request; i < maxi; i++) {
            request = queue.pop(i);

            if(request) {
                try {
                    request(time);
                } catch(err) {
                    _rethrow(err);        
                }
            }
        }

        lastFullfilledRequestId = maxi;
    }
    
    
    function getQueue() {
        return queue;
    }

    
    function trigger(time) {
        if(mode !== modes.MANUAL) {
            throw new Error('mode is not set to \'manual\' but manual trigger was requested');
        } else if(('number' !== typeof time) || isNaN(time)) {
            throw new TypeError('time provided as parameter 1 is not a number');
        } else {
            _trigger(time);
        }
    }
    
    
    function setMode(newMode, newParams) {
        if(newMode !== mode) {
            if(mode === modes.INTERVAL) {
                params.clearInterval(requestedAnimationFrame);
            } else if(mode === modes.PROXY_PASS) {
                params.cancelAnimationFrame(requestedAnimationFrame);
            }
            
            if(newMode === modes.MANUAL) {
                params = { };
            } else if(newMode === modes.INTERVAL) {
                if('object' !== typeof params) {
                    throw new TypeError('configuration provided as parameter 2 is not an object');
                } else if('function' !== typeof newParams.setInterval) {
                    throw new TypeError('setInterval property of configuration object is not a function');
                } else if('function' !== typeof newParams.clearInterval) {
                    throw new TypeError('clearInterval property of configuration object is not a function');
                } else if('function' !== typeof newParams.frameTime) {
                    throw new TypeError('frameTime property of configuration object is not a function');
                } else if('number' !== typeof newParams.time) {
                    throw new TypeError('time property of configuration object is not a number');
                } else {
                    params = newParams;   
                }
                
                requestedAnimationFrame = params.setInterval(function() {
                   _trigger(params.frameTime(previousTime, frameCount)); 
                }, params.time);
            } else if(newMode === modes.PROXY_PASS) {
                if('object' !== typeof params) {
                    throw new TypeError('configuration provided as parameter 2 is not an object');
                } else if('function' !== typeof newParams.requestAnimationFrame) {
                    throw new TypeError('requestAnimationFrame property of configuration object is not a function');
                } else if('function' !== typeof newParams.cancelAnimationFrame) {
                    throw new TypeError('cancelAnimationFrame property of configuration object is not a function');
                } else {
                    params = newParams;   
                }
                
                requestedAnimationFrame = params.requestAnimationFrame(function proxy(time) {
                    _trigger(time);
                    
                    requestedAnimationFrame = params.requestAnimationFrame(proxy);
                });
            } else {
                throw new Error('mode can be only 1 (MANUAL), 2 (INTERVAL) or 3 (PROXY_PASS)');
            }
            
            queue.clear();
            lastFullfilledRequestId = id;
            frameCount = 0;
            previousTime = 0;
            mode = newMode;
        }
    }


    return {
        getQueue: getQueue,
        trigger: trigger,
        setMode: setMode,
        modes: modes
    };

})();
