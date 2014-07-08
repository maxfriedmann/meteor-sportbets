# Latency


### Installation
```sh
$ mrt add latency
```

### Usage
```javascript
Meteor.latency(amount);
```
The `amount` is an optional integer for how much latency to introduce. You should probably keep `amount` to 5 or lower.

### Example
```javascript

// BOTH SERVER AND CLIENT
Meteor.methods({
  myMethod: function () {

    // Add latency if we're on the server
    if (!this.isSimulation) {
      Meteor.latency(2);
    }
    return 'result';
  }
});

// CLIENT
Meteor.call('myMethod', function (error, result) {
  console.log(result);
});
```

### Background
Inspired by @cmather [meteor-methods](https://github.com/EventedMind/meteor-methods) demo. Found myself using the bogus loop quite a bit when checking login forms, etc., for my different Meteor projects.
