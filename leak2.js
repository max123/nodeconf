
new Error().stack;
var
vm       = require("vm"),
total    = 1000000,
result   = null;

console.log("STARTING");
process.nextTick(function run() {
  var script = vm.createScript('setInterval(function() {}, 0);', 'test.js');
  var sandbox = { setInterval: setInterval };
  script.runInNewContext(sandbox);

  total--;
  if (total) {
/*    process.nextTick(run); */
      setTimeout(function() {
	  run();
      }, 1000);
  } else {
    console.log("COMPLETE");
  }
});
