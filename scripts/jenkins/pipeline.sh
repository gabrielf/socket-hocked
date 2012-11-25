export AMAZON_HOSTNAME=ec2-54-246-25-232.eu-west-1.compute.amazonaws.com

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"${DIR}/1-unit-tests.sh" || exit -1
"${DIR}/2-deploy.sh" || exit -1
"${DIR}/3-functional-tests.sh"

if [[ $? -eq 0 ]]; then
  "${DIR}/4-success.sh"
else
  echo "${DIR}/4-rollback.sh"
fi
