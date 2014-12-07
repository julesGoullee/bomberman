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
                return {};
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