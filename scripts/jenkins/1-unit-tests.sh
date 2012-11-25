# this makes sure the script exists on the first non zero exit code
set -e

# make sure dependencies exists before running unit tests
npm install

# run unit tests in jenkins
npm test
