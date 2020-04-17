$(document).ready(() => {
  $('#password, #confirm').on('keyup', function () {
    if ($('#password').val() != $('#confirm').val()) {
      $("#confirmtext").css('color','red');
      $("#btnSubmit").attr("disabled", true);
    }
    else {
      $("#confirmtext").css('color','white');
      $("#btnSubmit").attr("disabled", false);
    }
  });
});