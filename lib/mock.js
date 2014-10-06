module.exports = (function() {

    var trigger = require('./trigger');
    
    var queue = trigger.getQueue();


    function requestAnimationFrame(callback) {
        if('function' !== typeof callback) {
            throw new TypeError('Failed to execute \'requestAnimationFrame\' on \'Window\': The callback provided as parameter 1 is not a function.');
        } else {
            return queue.push(callback);
        }
    }
    
    
    function cancelAnimationFrame(requestId) {
        queue.pop(requestId);
    }


    return {
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame
    };

})();