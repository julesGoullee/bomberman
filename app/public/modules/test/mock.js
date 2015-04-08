"use strict";

var gameMock = {

    assets : {
        "ground" : [{}],
        "permanentBlocks": [{}],
        "permanentBlocksColision": [{}],
        "tour": [{}],
        "tourColision": [{}],
        "tempBlock": [{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "tempBlockColision": [{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "personnage" :[{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "persocourse" :[{
            clone : function (){
                return {
                    dispose : function (){},
                    setPivotMatrix: function(){}
                };
            },
            skeleton : {
                clone : function (){
                    return { dispose : function (){} };
                }
            }
        }],
        "personnageColision" :[{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "bomb" :[{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "bombColision" :[{
            clone : function (){
                return { dispose : function (){} };
            }
        }],
        "powerUpBallon" :[{
            clone : function (){
                return {
                    dispose : function (){}
                };
            },
            skeleton : {
                clone : function (){
                    return {};
                }
            }
        }]
    },
    blockDim: 8,
    scene : {
        beginAnimation : function( shape, from, to, loop, speed, callback ){
            callback && callback();
        }
    }
};

utils.onMeshsExitIntersect = function( meshToActivate ){

    meshToActivate.checkCollisions = true;
};

function ConnectorMock (){

    this.setTokenAndReturnUseProfil = function( token, callback ){

        callback({ name: "player1", err: null, token: token });
    };

    this.onSetUser = function( callback ){
        //todo;
    }
}

function PopupMock() {

    var self = this;

    self.setContent = function( header, body ){
    };

    self.show = function(){
    };

    self.hide = function(){
    };
}
