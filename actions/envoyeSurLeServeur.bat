@echo off
set /p message="Message: " %=%
cd ..
call "cmd /c git commit -am '%message%'"
call "cmd /c git push"