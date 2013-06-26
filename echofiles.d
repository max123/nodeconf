echofile*:::fs-read-start
{
	node[copyinstr(arg0)] = timestamp;
}

syscall::read:entry
/node[fds[arg0].fi_name]/
{
	self->ts = timestamp;
}

syscall::read:return
/self->ts/
{
	@r["read system call"] = quantize(timestamp-self->ts);
	self->ts = 0;
}

echofile*:::fs-read-done
/node[copyinstr(arg0)]/
{
	@f["echofiles"] = quantize(timestamp-node[copyinstr(arg0)]);
	node[copyinstr(arg0)] = 0;
}
