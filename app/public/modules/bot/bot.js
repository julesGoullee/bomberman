"use strict";

function Bot( position, map, scene, blockDim, assets ) {

    var self = this;


    //PUBLIC METHODS//

    self.run = function(){
        var freeCase = map.getFreeCases();

        var freeCaseSort = getFreeCaseSort(freeCase);

        var iCurrentCase = 0;
        for( iCurrentCase; iCurrentCase < freeCaseSort.length; iCurrentCase++){
            var tabNearCase = [
                {
                    x:self.player.position.x - blockDim *2,
                    z:self.player.position.z
                },
                {
                    x:self.player.position.x,
                    z:self.player.position.z - blockDim*2
                },
                {
                    x:self.player.position.x + blockDim*2,
                    z: self.player.position.z
                },
                {
                    x: self.player.position.x,
                    z: self.player.position.z + blockDim*2
                }
            ];

            var iCurrentNearCase = 0;

            for(iCurrentNearCase; iCurrentNearCase < tabNearCase.length; iCurrentNearCase++){
                var xFreeCase = freeCaseSort[iCurrentCase].x * blockDim;
                var zFreeCase = freeCaseSort[iCurrentCase].z *blockDim;
                if( tabNearCase[iCurrentNearCase].x >  xFreeCase -2 && tabNearCase[iCurrentNearCase].x <  xFreeCase +2   &&
                    tabNearCase[iCurrentNearCase].z >  zFreeCase -2 && tabNearCase[iCurrentNearCase].z <  xFreeCase +2     ){
                    // the torus destination position

                    var nexPos = {
                        x : parseInt(self.player.position.x,10),
                        z : parseInt(self.player.position.z,10),
                        y: parseInt(self.player.position.y,10)
                    };
// Animation keys
                    var keysTorus = [];
                    keysTorus.push({
                        frame: 0,
                        value:nexPos
                    });
                    var animationTorus = new BABYLON.Animation("botEasingAnimation", "position",30,  BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    keysTorus.push({ frame: 30, value:  new BABYLON.Vector3(tabNearCase[iCurrentNearCase].x, 0, tabNearCase[iCurrentNearCase].z) });
                    animationTorus.setKeys(keysTorus);

                    self.player.meshs.shape.animations.push(animationTorus);
                    if(self.player.meshs.shape.animations.length == 0) {
                        scene.beginAnimation(self.player.meshs.shape, 0, 100, false);

                    }

//Finally, launch animations on torus, from key 0 to key 120 with loop activated
                    setTimeout(function(){
                        self.run();
                    },2000);
                    break;
                }
            }
        }
    };
    //PRIVATE METHODS//

    function init(){

        self.player = new Player( "bot", position, assets, blockDim );
        scene.beginAnimation(self.player.meshs.shape.skeleton, 0, 100, true);

        setTimeout(function() {
            self.run();

        }, 3000);


    }

    function getFreeCaseSort (freeCase ) {

        return freeCase.sort(function (a, b) {
            // Sort by count
            var dCount = a.x - b.x;
            if (dCount) return dCount;

            // If there is a tie, sort by year
            var dYear = a.z - b.z;
            return dYear;
        });
    }

    init();
}