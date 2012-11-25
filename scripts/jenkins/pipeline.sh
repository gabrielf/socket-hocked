export AMAZON_HOSTNAME=ec2-54-246-25-232.eu-west-1.compute.amazonaws.com

./1-unit-tests.sh || exit -1
./2-deploy.sh || exit -1
./3-functional-tests.sh

if [[ $? -eq 0 ]]; then
  ./4-success.sh
else
  echo "./4-rollback.sh"
fi
