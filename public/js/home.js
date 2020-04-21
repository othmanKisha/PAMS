var pdlft = "250px";
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

const getAnnouncements = ann => {
  $(".annBody").remove();
  $("#annTable").append('<tbody class="annBody"></tbody>');
  if (ann != undefined)
    ann.forEach(a => {
      $(".annBody").append(
        `<tr>`,
        `<td> ${a.content}</td>`,
        `<td> ${a.submitter} at ${a.date}</td>`,
        `</tr>`
      );
    });
};

$(document).ready(() => {
  $("#sidebarCollapse").on("click", () => {
    if (hide) $("#sidebar").hide();
    else $("#sidebar").show();
    hide = hide ? false : true;
    pdlft = pdlft == "250px" ? "0px" : "250px";
    $("#content").css("padding-left", pdlft);
  });

  $("#announce").on("click", () => {
    getAnnouncements(announcements);
  });

  // Search Functionality should be added
});
