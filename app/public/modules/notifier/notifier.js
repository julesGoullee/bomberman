function Notifier () {

    var self = this;

    var growlConf = {
        ele: 'body', // which element to append to
        type: 'success', // (null, 'info', 'danger', 'success')
        offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
        align: 'center', // ('left', 'right', or 'center')
        width: 'auto', // (integer, or 'auto')
        delay: 1000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        allow_dismiss: false, // If true then will display a cross to close the popup.
        stackup_spacing: 10 // spacing between consecutively stacked growls.
    };

    self.showMessage = function ( message ) {

        //$.bootstrapGrowl({
        //    icon: 'glyphicon glyphicon-refresh',
        //    message: message
        //});
        $.bootstrapGrowl(message, growlConf);

    };

    //function init() {
    //    $.bootstrapGrowl("This is another test.", { type: 'success' });
    //    //$.bootstrapGrowl(false, {
    //    //    element: 'body',
    //    //    type: "success",
    //    //    allow_dismiss: false,
    //    //    placement: {
    //    //        from: "top",
    //    //        align: "center"
    //    //    },
    //    //    offset: 15,
    //    //    spacing: 10,
    //    //    z_index: 2031,
    //    //    delay: 200,
    //    //    timer: 1,
    //    //    mouse_over: false,
    //    //    animate: {
    //    //        enter: 'animated zoomInDown',
    //    //        exit: 'animated zoomOutUp'
    //    //    },
    //    //    icon_type: 'class',
    //    //    template: '<div data-growl="container" class="alert notifierContainer" role="alert">' +
    //    //        '<button type="button" class="close" data-growl="dismiss">' +
    //    //            '<span aria-hidden="true">×</span>' +
    //    //            '<span class="sr-only">Close</span>' +
    //    //        '</button>' +
    //    //        '<span data-growl="icon"></span>' +
    //    //        '<span data-growl="title"></span>' +
    //    //        '<span data-growl="message" class="notiferMessage"></span>' +
    //    //        '<a href="#" data-growl="url"></a>' +
    //    //    '</div>'
    //    //});
    //}
    //
    //init();

}