#!/bin/sh
echo "$1" | sudo -S forever stopall
echo "all process stop!" >&2
# git pull &&
echo "Update project files!" >&2
sudo forever start app/index.js
echo "Nodejs app/index.js start!" >&2
exit

