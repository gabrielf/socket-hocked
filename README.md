SocketHooked
============

A simple webhooks to websocket proxy.

Some services, such as Github, offer webhooks for easy integration with other
server software. SocketHocket can be used to integrate with these systems when
you don't have the ability to receive HTTP requests. Perhaps you are running
some client software locally or maybe you're just behind a firewall.

SocketHooked should be run where it can be reached from the internet. Clients
can then connect to SocketHooked using a websocket and receive the webhooks
that are otherwise out of reach.
