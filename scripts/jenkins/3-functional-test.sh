# first verify that the new revision pushed to amazon has actually been started
AMAZON_REVISION=`curl http://${AMAZON_HOSTNAME}/revision`

if [[ $? -ne 0 ]]; then
  echo "Unable to fetch revision from amazon"
  exit -1
fi

LOCAL_REVISION=`git rev-parse --short HEAD`

if [[ $? -ne 0 ]]; then
  echo "Unable to determine local git revision"
  exit -1
fi

if [[ $AMAZON_REVISION != $LOCAL_REVISION ]]; then
  echo "The newest revision ($LOCAL_REVISION) is not running on amazon ($AMAZON_REVISION), bailing out"
  exit -1
fi

# functional tests
NODE_ENV=production mocha --reporter spec tests/functional/
