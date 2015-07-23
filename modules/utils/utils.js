"use strict";

module.exports = {

    guid: function() {

        return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 );
    },
    clone: function( obj ){

        var clone = {};

        if( obj == null || typeof( obj ) !== "object" ){

            return obj;
        }

        for( var i in obj ){

            if( obj.hasOwnProperty( i ) && typeof( obj[i] ) === "object" && obj[i] != null ){

                clone[i] = this.clone( obj[i] );
            }
            else {

                clone[i] = obj[i];
            }
        }

        return clone;
    },
    uniqueElementById: function( arrayUnique, arrayToAdd ){

        for( var i = 0; i < arrayToAdd.length; i++ ){
            var item = arrayToAdd[i];

            if( arrayUnique.length === 0 ){
                arrayUnique.push( item );
            }
            else {
                var isNew = true;
                for( var j = 0; j < arrayUnique.length; j++ ){

                    var uniqueItem = arrayUnique[j];

                    if( uniqueItem.id == item.id ){
                        isNew = false;
                    }
                }
            }

            if( isNew ){
                arrayUnique.push(item);
            }
        }
        return arrayUnique;
    }
};