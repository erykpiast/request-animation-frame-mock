request-animation-frame-mock
============================

Mock of requestAnimationFrame API.

## Usage ##
```
  var requestAnimationFrameMock = require('request-animation-frame-mock');
  
  var testedModule = proxyquire('example', {
    'request-animation-frame': requestAnimationFrameMock.mock
    /* mock field is an object with two functions
      requestAnimationFrame and cancelAnimationFrame
    */
  });
  
  // manual mode is default
  // it allows you to manually trigger frame callbacks with specified time
  requestAnimationFrameMock.setMode(requestAnimationFrameMock.modes.MANUAL);
  
  // you can use trigger method only in manual mode
  requestAnimationFrame.trigger(1000);
  
  
  // interval mode allows you to schedule calling frame callback
  requestAnimationFrameMock.setMode(requestAnimationFrameMock.modes.INTERVAL, {
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    time: 4, // time to pass to setInterval function
    // result of function below is passed to frame callbacks
    // the first argument is previously returned time (0 initially),
    // the second is amount of emitted frames in current mode
    // (both variables are reseted after each mode change)
    frameTime: function(previousTime, framesCount) {
      return (previousTime + (1000 / 60) + (Math.random() * (1000 / 60)));
    }
  });
  
  
  // proxy pass mode allows you to test your module
  // with real requestAnimationFrame API
  requestAnimationFrameMock.setMode(requestAnimationFrameMock.modes.PROXY_PASS, {
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window)
  });
  
  
  // you can get queue of frame callbacks; it's plain object
  var queue = requestAnimationFrameMock.getQueue();
  
  console.log(Object.keys(queue).length); // or something

```
