module.exports = (function() {

    var extend = require('extend');

    var trigger = require('./lib/trigger');
    var mock = require('./lib/mock');
    
    
    return extend({
        mock: mock
    }, trigger);

})();