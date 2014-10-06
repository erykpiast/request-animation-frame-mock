module.exports = (function() {

    function Queue(getUniqueId) {
        this._queue = {};

        this._getUniqueId = getUniqueId;
    }


    Queue.prototype = {
        push: function(fn) {
            var id = this._getUniqueId();

            this._queue[id] = fn;

            return id;
        },
        pop: function(id) {
            var fn = this._queue[id];

            delete this._queue[id];

            return fn;
        },
        clear: function() {
            this._queue = { };
        }
    };


    return Queue;

})();