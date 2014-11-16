"use strict";

var gameMock = {
    assets : {
        "ground" : [{}],
        "permanentBlocks": [{}],
        "permanentBlocksColision": [{}],
        "tempBlock": [{
            clone : function (){
                return {};
            }
        }],
        "tempBlockColision": [{
            clone : function (){
                return {};
            }
        }]
    }
};

var Block = function(){};