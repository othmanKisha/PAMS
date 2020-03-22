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
    $("#submitForm").click(() => {
        var data = $('#form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var test = true;
        for (var d in data)
            if (data[d] == '') {
                test = false;
                break;
            }
        if (test) {
            fetch("http://localhost:3000/visits", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }).then(res => {
                window.location.href = res.url;
            });
        } else
            alert("Please fill all details")
    });
});