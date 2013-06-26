/*
 * This script demonstrates a simple stack trace involving an anonymous
 * function, then goes into an infinite loop so you can more easily catch it
 * with DTrace.  One caveat: we grab a stack trace at the start to force V8 to
 * compute line number information for this script.  If we didn't have this,
 * DTrace would print out position-in-file information instead of line numbers.
 */
new Error().stack;

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
