#!/bin/bash
echo "$1" | sudo -S forever stopall
echo "all process stop!" >&2
sudo forever start app/server/index.js &&
echo "Nodejs app/server/index.js start!" >&2
exit