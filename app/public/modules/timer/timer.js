"use strict";

function Timer( map ){
    var self = this;

    var _timeUnite;
    var _timeValue;
    var _timeoutDecompteToStartParty;

    //PUBLIC METHODS//
    self.timeToStartParty = 0;
    self.timeInParty = 0;

    self.showTimerToStartParty = function( timerToStart ){
        self.timeToStartParty = timerToStart;

        $("#timer-label").text("En attente d'autre joueurs la partie demarre dans");
        _timeUnite.text("secondes à attendre...");
        _timeValue.text( self.timeToStartParty/1000 );
        _timeUnite.show();

        decompteToStartParty( timerToStart );
    };

    self.startGame = function( timeParty ){
        self.timeInParty = timeParty;

        clearTimeout( _timeoutDecompteToStartParty );

        $("#timer-label").text("On mange du chat dans:");
        _timeUnite.show();
        _timeUnite.text("secondes");
        decompteInparty();
    };
    //PRIVATE METHODS//

    function decompteInparty( ){
        setTimeout(function(){
            _timeValue.text( self.timeInParty / 1000 );
            self.timeInParty = self.timeInParty - 1000;
            decompteInparty( self.timeInParty );
        },1000);
    }

    function decompteToStartParty( ){

        _timeoutDecompteToStartParty = setTimeout(function(){
            if(  self.timeToStartParty <= cfg.limitToCheckNumberPlayer ) {
                $("#time-unite").hide();

                if( map.getPlayers().length < cfg.nbPlayersToStart ) {
                    $("#timer-label").text("A partir de deux joueurs la partie demarreras...");
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
    }

    init();
}