@echo off
call "cmd /c git pull"
call "cmd /c grunt config_dev"
call "cmd /c git push"
set /p message="Message: " %=%
cd ..
call "cmd /c git add --all"
call "cmd /c git commit -m '%message%'"
call "cmd /c git push"
