"use strict";

define(function() {
    return function Timer(map) {

        var self = this;

        //JQ elements
        var _timeUnite;
        var _timeValue;
        var _timerContainer;
        var _timeLabel;

        var _timeoutDecompteToStartParty;
        var _timeoutDecompteInParty;
        var _callbackOnEnd;

        //PUBLIC METHODS//
        self.timeToStartParty = 0;
        self.timeInParty = 0;
        self.limitToCheckNumberPlayer = 0;
        self.nbPlayersToStart = 0;

        self.showTimerToStartParty = function () {

            clearTimeout(_timeoutDecompteInParty);

            _timeLabel.text("En attente d'autres joueurs");
            _timeValue.text(self.timeToStartParty / 1000);
            _timeUnite.text("secondes restantes...");
            _timeUnite.show();

            decompteToStartParty(self.timeToStartParty);
        };

        self.startGame = function (timeParty) {
            self.timeInParty = timeParty;

            clearTimeout(_timeoutDecompteToStartParty);

            _timeLabel.text("On mange du chat dans:");
            _timeUnite.show();
            _timeUnite.text("secondes");
            _timeValue.text(self.timeInParty / 1000);
            decompteInParty();
        };

        self.onTimerEnd = function (callback) {
            _callbackOnEnd = callback;
        };

        self.show = function () {
            _timerContainer.show();
        };

        self.hide = function () {

            _timerContainer.hide();
            _timeUnite.empty();
            _timeValue.empty();
        };

        //PRIVATE METHODS//

        function decompteInParty() {

            _timeValue.text(self.timeInParty / 1000);
            self.timeInParty = self.timeInParty - 1000;

            _timeoutDecompteInParty = setTimeout(function () {

                if (self.timeInParty <= 0) {
                    setTimeout(function () {

                        _timeLabel.text("A table");
                        _timeUnite.empty();
                        _timeValue.text("Terminé!");
                        return typeof _callbackOnEnd === "function" && _callbackOnEnd();
                    }, 1000);
                }
                else {

                    decompteInParty(self.timeInParty);
                }
            }, 1000);
        }

        function decompteToStartParty() {

            _timeoutDecompteToStartParty = setTimeout(function () {

                if (self.timeToStartParty <= self.limitToCheckNumberPlayer) {

                    $("#time-unite").hide();

                    if (map.getPlayers().length < self.nbPlayersToStart) {

                        _timeLabel.text("En attente de " + ( self.nbPlayersToStart - map.getPlayers().length ) + " joueurs...");
                        _timeValue.text("Invite des amis !");
                    }
                    else {

                        $("#timer-label").text("Prepare toi !");
                        _timeValue.text("la partie va démarrer !");
                    }
                }
                else {

                    self.timeToStartParty = self.timeToStartParty - 1000;
                    _timeValue.text(self.timeToStartParty / 1000);
                    _timeUnite.show();
                    _timeUnite.text("secondes restantes...");
                }

                decompteToStartParty();
            }, 1000);
        }

        function init() {

            var timerHtml = "<div class='panel panel-default container-fluid' id='timer-container'>" +
                "<div class='panel-heading'>" +
                "<span class='panel-title' id='timer-label'></span>" +
                "</div>" +
                "<div class='panel-body'>" +
                "<span class='time-value-container'>" +
                "<span id='timer-value' class='center-block'></span>" +
                "<span id='time-unite'></span>" +
                "</span>" +
                "</div>" +
                "</div>";

            $('body').append(timerHtml);
            _timeUnite = $("#time-unite");
            _timeValue = $("#timer-value");
            _timerContainer = $("#timer-container");
            _timeLabel = $("#timer-label");
        }

        init();
    };
});
