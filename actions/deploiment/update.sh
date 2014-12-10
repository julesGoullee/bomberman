#!/bin/sh
echo "all process stop!" >&2
git pull &&
echo "Update project files!" >&2
npm run prod &&
echo "Configuation deploiment" >&2
exit

