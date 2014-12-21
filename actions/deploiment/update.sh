#!/bin/sh
echo "Git pull..." >&2
git pull &&
echo "Git pull [OK]" >&2
echo "Configuration production..." >&2
npm run prod &&
echo "Configuration production..." >&2
echo "Update success :)" >&2
exit

