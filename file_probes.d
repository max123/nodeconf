#!/usr/sbin/dtrace -s

#pragma D option temporal

fileapp$target:::rimraf
{
	printf("%s\n", copyinstr(arg0));
}

fileapp$target:::srcstream
{
	printf("%s\n", copyinstr(arg0));
}

fileapp$target:::chksum
{
	printf("%s\n", copyinstr(arg0));
/*	printf("%d\n", arg1); */
}
