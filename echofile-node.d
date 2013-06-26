
node*:::http-server-request
{
	printf("url = %s\n", args[0]->url);
	printf("method = %s\n", args[0]->method);
	printf("fd = %d\n", args[1]->fd);
	printf("remote address = %s\n", args[1]->remoteAddress);
	printf("remote port = %d\n", args[1]->remotePort);
	printf("buffer size = %d\n", args[1]->bufferSize);
	remoteport = args[1]->remotePort;
	url = args[0]->url;
	rts = timestamp;
}

node*:::http-server-response
/remoteport == args[0]->remotePort/
{
	printf("fd = %d\n", args[0]->fd);
	printf("remote address = %s\n", args[0]->remoteAddress);
	printf("remote port = %d\n", args[0]->remotePort);
	printf("buffer size = %d\n", args[0]->bufferSize);
	@["latency", url] = quantize(timestamp-rts);
}

echofile-server*:::fs-read-start
{
	node[copyinstr(arg0)] = timestamp;
}

syscall::read:entry
/node[fds[arg0].fi_name]/
{
	self->ts = timestamp;
	self->fn = fds[arg0].fi_name;
}

syscall::read:return
/self->ts/
{
	@r["read syscall", self->fn] = quantize(timestamp-self->ts);
	self->ts = 0;
	self->fn = 0;
}

echofile-server*:::fs-read-done
/node[copyinstr(arg0)]/
{
	this->fn = copyinstr(arg0);
	@f["fs-read", this->fn] = quantize(timestamp-node[copyinstr(arg0)]);
	node[this->fn] = 0;
}
