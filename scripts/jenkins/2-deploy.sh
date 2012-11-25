# this makes sure the script exists on the first non zero exit code
set -e

# setup remote if it's not already setup
git remote | grep amazon || git remote add amazon ssh://ubuntu@${AMAZON_HOSTNAME}/home/ubuntu/sockethooked.git

# add amazon key so that jenkins can communicate with the server
ssh-add ~/.ssh/imac-hemma.pem

# jenkins git plugin doesn't checkout branches like you normally do so in
# order to push master we need to first make sure it's containing the latest
# code. We don't fetch new changes since we might then push code that is newer
# than the code which for which unit tests were run
git co master
git merge origin/master

# ok, let's push it to amazon already!
git push amazon master
