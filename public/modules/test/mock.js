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
                return {};
            }
        }],
        "tempBlockColision": [{
            clone : function (){
                return {};
            }
        }],
        "personnage" :[{
            clone : function (){
                return {};
            }
        }],
        "bomb" :[{
            clone : function (){
                return {};
            }
        }],
        "bombColision" :[{
            clone : function (){
                return {};
            }
        }]
    },
    blockDim: 8
};