"use strict";

function Timer( map ){
    var self = this;

    //JQ elements
    var _timeUnite;
    var _timeValue;
    var _timerContainer;
    var _timeLabel;

    var _timeoutDecompteToStartParty;
    var _callbackOnEnd;

    //PUBLIC METHODS//
    self.timeToStartParty = 0;
    self.timeInParty = 0;

    self.showTimerToStartParty = function( timerToStart ){
        self.timeToStartParty = timerToStart;

        _timeLabel.text("En attente d'autres joueurs");
        _timeValue.text( self.timeToStartParty/1000 );
        _timeUnite.text("secondes restantes...");
        _timeUnite.show();

        decompteToStartParty( timerToStart );
    };

    self.startGame = function( timeParty ){
        self.timeInParty = timeParty;

        clearTimeout( _timeoutDecompteToStartParty );

        _timeLabel.text("On mange du chat dans:");
        _timeUnite.show();
        _timeUnite.text("secondes");
        _timeValue.text( self.timeInParty / 1000 );
        decompteInparty();
    };

    self.onTimerEnd = function( callback ){
        _callbackOnEnd = callback;
    };

    self.show= function(){
        _timerContainer.show();
    };

    self.hide = function(){
        _timerContainer.hide();
        _timeUnite.empty();
        _timeValue.empty();
    };

    //PRIVATE METHODS//

    function decompteInparty(){
        _timeValue.text( self.timeInParty / 1000 );
        self.timeInParty = self.timeInParty - 1000;
        setTimeout(function(){


            if( self.timeInParty <= 0 ){
                setTimeout(function(){
                    _timeLabel.text("A table");
                    _timeUnite.empty();
                    _timeValue.text("Terminé!");
                    _callbackOnEnd && _callbackOnEnd();
                }, 1000);
            }
            else {
                decompteInparty( self.timeInParty );
            }
        },1000);
    }

    function decompteToStartParty(){

        _timeoutDecompteToStartParty = setTimeout(function(){
            if(  self.timeToStartParty <= cfg.limitToCheckNumberPlayer ) {
                $("#time-unite").hide();

                if( map.getPlayers().length < cfg.nbPlayersToStart ) {
                    _timeLabel.text("En attente de " + ( cfg.nbPlayersToStart - map.getPlayers().length ) + " joueurs...");
                    _timeValue.text("Invite des amis !");
                }
                else{
                    $("#timer-label").text("Prepare toi !");
                    _timeValue.text("la partie va démarrer !");
                }
            }
            else{
                _timeValue.text( self.timeToStartParty/1000 );
                _timeUnite.show();
                _timeUnite.text("secondes à attendre...");
                self.timeToStartParty = self.timeToStartParty - 1000;
            }

            decompteToStartParty();
        },1000);
    }

    function init (){
        var timerHtml = "<div class='panel panel-default container-fluid' id='timer-container'>"+
            "<div class='panel-heading'>"+
                "<span class='panel-title' id='timer-label'></span>"+
            "</div>"+
            "<div class='panel-body'>" +
                "<span class='time-value-container'>" +
                    "<span id='timer-value' class='center-block'></span>" +
                    "<span id='time-unite'></span>" +
                "</span>"+
            "</div>"+
        "</div>";

        $('body').append( timerHtml );
        _timeUnite = $("#time-unite");
        _timeValue = $("#timer-value");
        _timerContainer = $("#timer-container");
        _timeLabel = $("#timer-label");
    }

    init();
}