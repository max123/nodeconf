#!/usr/sbin/dtrace -qs

#pragma D option temporal

syscall::read:entry
/pid == $target && fds[arg0].fi_pathname == "/home/student/nodeconf/words"/
{
	printf("read request %d bytes\n", arg2);
}

syscall::write:entry
/pid == $target && fds[arg0].fi_pathname == "/home/student/nodeconf/tmp/words.save"/
{
	printf("write request %d bytes\n", arg2);
}

syscall::unlink*:entry
/pid == $target/
{
	printf("unlinking %s\n", copyinstr(arg0));
}
