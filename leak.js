
/* example that has a memory leak */
new Error().stack;

function leaker() {
    var v = new Array(1024*1024);
    for (var i = 0; i < 1024*1024; i++)
	v[i] = "hello";
}

function leaky() {
    var leaked = new leaker();
    var some = 20;
    setTimeout(leaky, 1);
    return function() {
	return some;
    };

};

leaky();

