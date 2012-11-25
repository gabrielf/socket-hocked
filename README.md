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

Continuous deployment
=====================

On every push to origin these are the steps that are done. If a step fails then the process is stopped if not stated otherwise.

1. The scripts/hooks-origin/post-receive will trigger a build in jenkins
2. Jenkins will run:
  1. Unit tests (scripts/jenkins/1-unit-tests.sh)
  2. Deploy to amazon by pushing code there (scripts/jenkins/2-deploy.sh)
  3. The scripts/hooks-amazon/post-receive will ensure npm dependencies are installed and node restarted
  4. Functional tests (scripts/jenkins/3-functional-tests.sh)
    a) On success: scripts/jenkins/4-success.sh will run and record the revision number
    b) On failure: scripts/jenkins/4-rollback.sh will run and rollback the server to the last known successful revision
