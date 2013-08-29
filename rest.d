#!/usr/sbin/dtrace -s

#pragma D option quiet

restify*:::route-start
{
	printf("route-start at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
	printf("  args[2] = %d\n", arg2);
	printf("  args[3] = %s\n", copyinstr(arg3));
	printf("  args[4] = %s\n", copyinstr(arg4));
	printf("  args[5] = %s\n", copyinstr(arg5));
}

restify*:::handler-start
{
	printf("handler-start at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
	printf("  args[2] = %s\n", copyinstr(arg2));
	printf("  args[3] = %d\n", arg3);
}

restify*:::handler-done
{
	printf("handler-done at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
	printf("  args[2] = %s\n", copyinstr(arg2));
	printf("  args[3] = %d\n", arg3);
}

restify*:::route-done
{
	printf("route-done at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
	printf("  args[2] = %d\n", arg2);
	printf("  args[3] = %d\n", arg3);
	printf("  args[4] = %s\n", copyinstr(arg4));
}

restify*:::client-request
{
	printf("client-request at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
	printf("  args[2] = %s\n", copyinstr(arg2));
	printf("  args[3] = %d\n", arg3);
}

restify*:::client-response
{
	printf("client-response at %lx nsecs:\n", timestamp);
	printf("  args[0] = %d\n", arg0);
	printf("  args[1] = %d\n", arg1);
	printf("  args[2] = %s\n", copyinstr(arg2));
}

restify*:::client-error
{
	printf("client-error at %lx nsecs:\n", timestamp);
	printf("  args[0] = %s\n", copyinstr(arg0));
	printf("  args[1] = %s\n", copyinstr(arg1));
}
