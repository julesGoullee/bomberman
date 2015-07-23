"use strict";

function Popup(){

    var self = this;


    var _container = $('body');

    self.setContent = function( header, body, footer){

        $("#popup-container").html( body );

        $("#popup-header").html( header );

        if( footer ){
            $("#popup-footer").html( footer );
        }
    };

    self.show = function(){

        _container.modal({
            backdrop: 'static',
            keyboard: false
        });
    };

    self.hide = function(){

        _container.modal("hide");
    };

    function init(){
        $('body').append(
            '<div class="modal fade" id="popup" role="dialog" aria-labelledby="popup" aria-hidden="true">'+
                "<div class='modal-dialog'>"+
                    "<div class='modal-content'>"+
                        "<div class='modal-header'>"+
                            //"<button type='button' class='close hideModal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                            "<div id='popup-header'></div>"+
                        "</div>"+
                        "<div class='modal-body' id='popup-container'></div>"+
                        "<div class='modal-footer' id='popup-footer'></div>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );

        _container = $("#popup");

        $(".hideModal").click(function(){

            self.hide();
        });
    }

    init();
}
