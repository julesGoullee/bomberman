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
        "personnage" :[{//todo a remplacer par le mesh
            clone : function (){
                return {};
            }
        }],
        "bomb" :[{//todo a remplacer par le mesh
            clone : function (){
                return {};
            }
        }]
    }
};