call "cmd /c npm install -g bower"
call "cmd /c npm install -g grunt-cli"
cd ..
call "cmd /c npm install"
call "cmd /c npm run postInstall"
exit