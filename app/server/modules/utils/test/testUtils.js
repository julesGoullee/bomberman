"use strict";
var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );

var utils = require("./../utils.js");

describe( "Utils", function() {
    beforeEach(function () {
        var utils = require("./../utils.js");
    });

    describe("uniqueElementById", function(){

        it("Peut ajouter alors que la premiere est vide", function(){
            var l1 = [];
            var l2 = [{id:4}, {id:5}, {id:6}, {id:7}];
            utils.uniqueElementById(l1, l2);
            expect(l1.length).to.equal(4);
        });

        it("Peut ajouter les deux listes", function(){
            var l1 = [{id:1}, {id:2}, {id:3}];
            var l2 = [{id:4}, {id:5}, {id:6}, {id:7}];
            utils.uniqueElementById(l1, l2);
            expect(l1.length).to.equal(7);
        });

        it("Peut ajouter les deux liste ayant un items en doublons", function(){
            var l1 = [{id:1}, {id:2}, {id:3}];
            var l2 = [{id:4}, {id:2}, {id:6}, {id:7}];
            utils.uniqueElementById(l1, l2);
            expect(l1.length).to.equal(6);
        });

        it("Peut ajouter les deux liste ayant plusieurs items en doublons", function(){
            var l1 = [{id:1}, {id:2}, {id:3}];
            var l2 = [{id:3}, {id:2}, {id:6}, {id:7}];
            utils.uniqueElementById(l1, l2);
            expect(l1.length).to.equal(5);
        });
    })
});