@echo off
set /p message="Message: " %=%
cd ..
call "cmd /c git add *"
call "cmd /c git commit -m '%message%'"
