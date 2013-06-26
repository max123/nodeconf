#!/usr/sbin/dtrace -s

#pragma D option quiet

echofile-server*:::echo-start
{
	printf("%s: %s\n", probename, copyinstr(arg0));
}

echofile-server*:::echo-done
{
	printf("%s: %s %d bytes\n", probename, copyinstr(arg0), arg1);
}

echofile-server*:::echo-error
{
	printf("%s\n", copyinstr(arg1));
}
