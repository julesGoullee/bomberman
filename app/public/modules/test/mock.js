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
        }]
    },
    blockDim: 8
};

utils.onMeshsExitIntersect = function( meshToActivate ){

    meshToActivate.checkCollisions = true;
};

function ConnectorMock (){

    this.setTokenAndReturnUseProfil = function( token, callback ){

        callback({ name: "player1", err: null, token: token });
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