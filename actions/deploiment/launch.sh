#!/bin/bash
scriptDir="`dirname $0`"
cd ${scriptDir}"/../../"
mkdir -p log
echo "Update sources..." &&
git pull &&
echo "Config prod" &&
grunt config_prod &&
echo "Stop all nodeapp" &&
forever stopall &&
echo "Start node app" &&
forever -o log/out.log -e log/err.log  --minUptime 500 --spinSleepTime 500 start bin/www.js &&
echo "Bombeman start :)"
exit