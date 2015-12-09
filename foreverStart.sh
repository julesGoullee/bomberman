#!/usr/bin/env bash
now=$(date +%Y'-'%m'-'%d'-'%H':'%M':'%S)
forever stop serve/index.js &&
mkdir -p log/$now && 
NODE_ENV=production forever -o log/$now/out.log -e log/$now/err.log  --minUptime 500 --spinSleepTime 500 start serve/index.js
