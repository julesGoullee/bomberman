#!/bin/bash
echo "All process stop..." >&2
echo "$1" | sudo -S forever stopall &&
echo "All process stop [OK]" >&2
echo "Start node app..." >&2
sudo forever start app/server/index.js -w &&
echo "Start node app [OK]" >&2
echo "Nodejs app/server/index.js start :)" >&2
exit