$(document).ready(() => {

    $('.input').focus(function () {
        $(this).parent().find(".label-txt").addClass('label-active');
    });
    $(".input").focusout(function () {
        if ($(this).val() == '') {
            $(this).parent().find(".label-txt").removeClass('label-active');
        };
    });
    $('.datepicker').datepicker({
        dateFormat: "dd MM, yy",
        minDate: 0,
    });
    $('.timepicker').mdtimepicker({
        format: 'h:mm tt',
        theme: 'indigo',
        hourPadding: true,
        clearBtn: true,
        readOnly: false,
    });
}