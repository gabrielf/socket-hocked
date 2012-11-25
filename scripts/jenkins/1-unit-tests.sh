# this makes sure the script exists on the first non zero exit code
set -e

# make sure dependencies exists
npm install

# run unit tests in jenkins
npm test

# verify revision
[[ `curl http://ec2-54-246-25-232.eu-west-1.compute.amazonaws.com/revision` = `git rev-parse --short HEAD` ]] || (echo "The newest source has not been deployed, bailing out" && exit -1)

# functional tests
NODE_ENV=production mocha --reporter spec tests/functional/
