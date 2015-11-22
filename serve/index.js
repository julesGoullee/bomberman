'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const app = require('./app');
const http = require('http');

const config = require('./config/config');
const serveLog = require('./modules/log/log').serve;

const Game = require('./modules/game/game.es6');

const server = http.createServer(app);

const io = (require('socket.io'))( server ).use( (socket, next) => {
  //GET session for websocket
  require('./middlewares/auth.es6').check(socket.request, {}, (isLog) => {
    if(isLog){
      next();
    }
    else{
      socket.disconnect();
    }
  });
});


function onListening(){
  serveLog.info('Listening on port ' + server.address().port);
  new Game(io);
}

function onError( err ){

  if( err.syscall !== 'listen' ){
    throw err;
  }

  switch( err.code ){
    case 'EACCES':
      console.error( config.port + ' requires root privileges' );
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error( config.port + ' is already in use' );
      process.exit(1);
      break;
    case 'EADDRNOTAVAIL':
      console.error( config.domaine + ' is not valid' );
      break;
    default:
      throw err;
  }
}


server.listen( config.port, config.domaine );

server.on( 'error', onError );
server.on( 'listening', onListening );
