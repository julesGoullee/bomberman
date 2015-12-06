'use strict';


class MockSocket {
  constructor (id){
    this.callbackDisconnect = null;
    this.callbackOnMyPosition = null;
    this.callbackSetBomb = null;
    
    this.request = {
      user : {
        _id: {
          toString: () => {
            return id;
          }
        },
        fb: {
          username: 'testPlayer_' + id,
          photo: { url : 'photo_url_' + 'testPlayer_' + id}
        }
      }
    };
  }
  emit (){

  }
  on (event, cb){
    if( event === 'myPosition' ){

      this.callbackOnMyPosition = cb;

    }else if( event === 'disconnect' ){

      this.callbackDisconnect = cb;

    }else if( event === 'setBomb'){

      this.callbackSetBomb = cb;
    }
  }

  removeListener (){
    
  }
}
module.exports = MockSocket;