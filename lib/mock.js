module.exports = (function() {

    var trigger = require('./trigger');
    
    var queue = trigger.getQueue();
    var id = 0;
    var requests = { };


    function requestAnimationFrame(callback) {
        if('function' !== typeof callback) {
            throw new TypeError('Failed to execute \'requestAnimationFrame\' on \'Window\': The callback provided as parameter 1 is not a function.');
        } else {
            id++;
            
            queue.push(callback);
            
            requests[id] = callback;
            
            return id;
        }
    }
    
    
    function cancelAnimationFrame(requestId) {
        if('undefined' !== typeof requests[requestId]) {
            var requestIndex = queue.indexOf(requests[requestId]);
            
            if(requestIndex !== -1) {
                queue.splice(requestIndex, 1);
            }
            
            delete requests[requestId];
        }
    }


    return {
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame
    };

})();