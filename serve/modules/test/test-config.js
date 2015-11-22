'use strict';

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );

var config = require("../../config/config");
config.timerToStartParty = 5000;
config.limitToCheckNumberPlayer = 4000;
config.nbPlayersToStart = 2;
config.analitics = false;