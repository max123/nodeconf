
/* server-latency.d */

#pragma D option quiet

node*:::http-server-request
{
	ts[args[1]->remoteAddress, args[1]->remotePort] = timestamp;
	url[ts[args[1]->remoteAddress, args[1]->remotePort]] = args[0]->url;
}

node*:::http-server-response
/ts[args[0]->remoteAddress, args[0]->remotePort]/
{
	this->t = ts[args[0]->remoteAddress, args[0]->remotePort];
	@[url[this->t], args[0]->remoteAddress] = quantize((timestamp-this->t)/1000);
	ts[args[0]->remoteAddress, args[0]->remotePort] = 0;
}

END
{
	printf("%-20s: %-16s\n", "URL", "REMOTEADDRESS");
	printa("%-20s: %-16s\nMICROSECONDS\n%@d\n", @);
}
