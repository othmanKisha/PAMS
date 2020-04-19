var pdlft = "200px";
var hide = true;
var announcements;

fetch("http://localhost:3000/announcements/Home")
  .then(response => {
    return response.json();
  })
  .then(data => {
    announcements = data;
  })
  .catch(err => {
    console.log(err);
  });

$(document).ready(() => {
  $("#sidebarCollapse").on("click", () => {
    if (hide) $("#sidebar").hide();
    else $("#sidebar").show();
    hide = hide ? false : true;
    pdlft = pdlft == "200px" ? "0px" : "200px";
    $("#content").css("padding-left", pdlft);
  });
  if (announcements != undefined)
    announcements.forEach(a => {
      $(".annBody").append(
        `<tr><td> ${a.content}</td>`,
        `<td> ${a.submitter} at ${a.date}</td></tr>`
      );
    });

  // Search Functionality should be added
});
