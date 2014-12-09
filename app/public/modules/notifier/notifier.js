function Notifier () {

    var self = this;

    self.showMessage = function ( message ) {

        $.growl({
            icon: 'glyphicon glyphicon-refresh',
            message: message
        });
    };

    function init() {

        $.growl(false, {
            element: 'body',
            type: "success",
            allow_dismiss: false,
            placement: {
                from: "top",
                align: "center"
            },
            offset: 15,
            spacing: 10,
            z_index: 2031,
            delay: 200,
            timer: 1,
            mouse_over: false,
            animate: {
                enter: 'animated zoomInDown',
                exit: 'animated zoomOutUp'
            },
            icon_type: 'class',
            template: '<div data-growl="container" class="alert notifierContainer" role="alert">' +
                '<button type="button" class="close" data-growl="dismiss">' +
                    '<span aria-hidden="true">×</span>' +
                    '<span class="sr-only">Close</span>' +
                '</button>' +
                '<span data-growl="icon"></span>' +
                '<span data-growl="title"></span>' +
                '<span data-growl="message" class="notiferMessage"></span>' +
                '<a href="#" data-growl="url"></a>' +
            '</div>'
        });
    }

    init();

}