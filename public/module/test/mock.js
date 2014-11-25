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
        "spherePlayer" :[{//todo a remplacer par le mesh
            clone : function (){
                return {};
            }
        }]
    }
};