"use strict";

function Popup(){

    var self = this;


    var _container = $('body');

    self.setContent = function( header, body ){

        $("#popup-container").html( body );

        $("#popup-header").html( header );
    };

    self.show = function(){

        _container.modal("show");
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
                            "<button type='button' class='close hideModal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
                        "<div id='popup-header'></div>"+
                    "</div>"+
                        "<div class='modal-body' id='popup-container'>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );

        _container = $("#popup");

        $(".hideModal").click(function(){

            _container.modal("hide");
        });
    }

    init();
}
