AMAZON_HOSTNAME=ec2-54-246-25-232.eu-west-1.compute.amazonaws.com

# first verify that the new revision pushed to amazon has actually been started
AMAZON_REVISION=`curl http://${AMAZON_HOSTNAME}/revision`
LOCAL_REVISION=`git rev-parse --short HEAD`

if [[ $AMAZON_REVISION != $LOCAL_REVISION ]]; then
  echo "The newest revision ($LOCAL_REVISION) is not running on amazon ($AMAZON_REVISION), bailing out"
  exit -1
fi

# functional tests
NODE_ENV=production mocha --reporter spec tests/functional/
