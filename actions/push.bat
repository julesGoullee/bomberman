@echo off
set /p message="Message: " %=%
call "cmd /c git commit -am '%message%'"