Meteor.latency = function (amount) {
  var amount = amount || 1;
  var bogus;
  for (var i = 0; i < amount * 1000000000; i++) {
    bogus = i;
  }
}
