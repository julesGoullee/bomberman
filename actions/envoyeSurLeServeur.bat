@echo off
set /p message="Message: " %=%
cd ..
call "cmd /c git add --all"
call "cmd /c git commit -m '%message%'"
call "cmd /c git push"
