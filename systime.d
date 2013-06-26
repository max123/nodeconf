#!/usr/sbin/dtrace -s

#pragma D option quiet

syscall:::entry
/execname == "node"/
{
	self->ts = timestamp;
}

syscall:::return
/self->ts/
{
	@[probefunc] = quantize(timestamp - self->ts);
	self->ts = 0;
}

END
{
	printa("SYSCALL    NSECS                                   # OF OCCURANCES\n%s%@lx\n", @);
}
