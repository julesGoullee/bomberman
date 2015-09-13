"use strict";

var onMeshsExitIntersect = function (meshToActivate, meshCollide, scene) {
    meshToActivate.actionManager = new BABYLON.ActionManager(scene);
    meshToActivate.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: meshCollide},
        function () {
        }
    ));
    meshToActivate.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: meshCollide},
        function () {
            meshToActivate.checkCollisions = true;
        }
    ));

};

define(["babylon"], function(BABYLON) {
    return {
        guid: function () {
            return Math.floor(( 1 + Math.random() ) * 0x10000)
                .toString(16);
        },
        clone: function (obj) {

            var clone = {};

            if (obj == null || typeof( obj ) !== "object") {

                return obj;
            }

            for (var i in obj) {

                if (obj.hasOwnProperty(i) && typeof( obj[i] ) === "object" && obj[i] != null) {

                    clone[i] = this.clone(obj[i]);
                }
                else {

                    clone[i] = obj[i];

                }
            }

            return clone;
        },
        onMeshsExitIntersect: onMeshsExitIntersect,
        addUniqueArrayProperty: function (array) {
            array.unique = function () {
                var a = this.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (JSON.stringify(a[i]) === JSON.stringify(a[j]))
                            a.splice(j--, 1);
                    }
                }

                return a;
            };
        }
    };

});
