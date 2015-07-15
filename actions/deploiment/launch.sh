#!/bin/bash
scriptDir="`dirname $0`"
cd ${scriptDir}"/../../"
mkdir -p log
echo "Update sources..." &&
git pull &&
echo "Config prod" &&
npm run prod &&
echo "Start forever daemon" &&
forever -o log/out.log -e log/err.log  --minUptime 500 --spinSleepTime 500 start app/server/index.js &&
echo "Bombeman start :)"
exit