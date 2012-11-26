SocketHooked
============

A simple webhooks to websocket proxy.

Some services, such as Github, offer webhooks for easy integration with other
server software. SocketHooket can transform these HTTP requests to events on a
websocket instead.

This can be useful in cases when you don't have the ability to receive HTTP
requests. Perhaps you are running some client software locally or maybe you're
on a network that cannot be reached from the internet.

SocketHooked should be run where it can be reached from the internet. Clients
can then connect to SocketHooked using a websocket and receive the webhooks
that are otherwise out of reach.

The project is also a little testbed for doing continuous deployment. That's
why there currently is no actual implementation but mostly infrastructure
around the deploy pipline instead.

## How to use

Start with "node app.js". SocketHooked will be available at localhost:8081

Go to http://localhost:8081/channel/{channel-id} where channel-id is a unique
string of your choosing.

You are now listening on a channel. Everything POSTed to the same URL will be
forwarded to you via a websocket and displayed on the page.

The actual HTML page is just for demo purposes, you can also connect directly
with a websocket. See the public/js/script.js or /tests/functional/test.js for
the details.

For now only form encoded and JSON POSTs will work.

JSON:

   > curl -H 'Content-Type: application/json' -d '{"some": "json"}' localhost:8081/channel/test

Form:

   > curl -F 'key=value' localhost:8081/channel/test

## Continuous deployment

* The setup consists of a origin repo with the post-receive hook found at:
scripts/hooks-origin/post-receive

* An amazon instace containing a bare git repo setup using "git init --bare ."
and the post-receive hook: scripts/hooks-amazon/post-receive

* A Jenkins server with a job that checks out the code from the origin and runs
scripts/jenkins/pipeline on every change.

### Features of the deployment pipeline

1. Builds are triggered on pushes to origin via a post-receive hook
2. Unit tests will be run on the continuous integration server
3. The code will be pushed to Amazon and functional tests will be run
4. If the functional tests do not pass then the code will be rollbacked to the
   latest working revision

### TODO

* I'd like functional tests to run locally before the deploy to Amazon. This
  should be done without requiring a heavyweight setup. Ideally a free port
  should be found and the app should be started using it and the tests should
  be run.
* The deploys should be without downtime by fronting the Node.js app using
  HAProxy or similar. Tests should be run during the deploy to verify that
  there is no downtime.
* Funcional tests should be run after a rollback to verify that the service is
  ok. The challange here is to run the right tests since the latests tests
  might fail if the test functionality that didn't exist in the last working
  revision.
* Improve the identification of the lastest working revision which is currently
  done using a lightwieght tag that only exists in the repo cloned by Jenkins.
* Decide how to handle the Amazon pem file on Jenkins.
