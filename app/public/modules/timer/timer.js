"use strict";

function Timer( map ){
    var self = this;

    var timeUnite;
    var timeValue;
    var timeoutDecompteToStartParty;

    //PUBLIC METHODS//
    self.showTimerToStartParty = function( timerToStart ){
        $("#timer-label").text("En attente d'autre joueurs la partie demarre dans");
        timeUnite.text("secondes à attendre...");
        timeUnite.show();
        decompteToStartParty( timerToStart );
    };

    self.startGame = function( timeParty ){
        clearTimeout( timeoutDecompteToStartParty );

        $("#timer-label").text("On mange du chat dans:");
        timeUnite.show();
        timeUnite.text("secondes");
        decompteInparty( timeParty );
    };
    //PRIVATE METHODS//

    function decompteInparty( timeReamining ){

        timeValue.text( timeReamining/1000 );
        timeReamining = timeReamining - 1000;

        setTimeout(function(){
            decompteInparty( timeReamining );
        },1000);
    }

    function decompteToStartParty( value ){
        if(  value < cfg.limitToCheckNumberPlayer ) {
            $("#time-unite").hide();

            if( map.getPlayers().length < cfg.nbPlayersToStart ) {
                $("#timer-label").text("A partir de deux joueurs la partie demarreras...");
                timeValue.text("Invite des amis !");
            }
            else{
                $("#timer-label").text("Prepare toi !");
                timeValue.text("la partie va démarrer !");
            }
        }
        else{
            $("#timer-value").text( value/1000 );
            timeUnite.show();
            timeUnite.text("secondes à attendre...");
            value = value - 1000;
        }

        timeoutDecompteToStartParty = setTimeout(function(){
            decompteToStartParty( value );
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
        timeUnite = $("#time-unite");
        timeValue = $("#timer-value");
    }

    init();
}