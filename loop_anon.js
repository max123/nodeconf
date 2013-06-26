/*
 * This script demonstrates a simple stack trace involving an anonymous
 * function, then goes into an infinite loop so you can catch it with the
 * debugger.  One caveat: we grab a stack trace at the start to force V8 to
 * compute line number information for this script.  If we didn't have this, the
 * debugger would only print out position-in-file information.
 */
new Error().stack;

new var = 10;

function main() { func1(); }
function func1() { func2(); }
function func2()
{
	(function () {
		for (;;)
			;
	})();
}
main();
