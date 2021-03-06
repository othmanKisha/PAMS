var pdlft = "250px";
var hide = true;
var announcements;

const getAnnouncements = () => {
  fetch("http://localhost:3000/announcements/Home")
    //fetch("https://pams-habboush-kisha.azurewebsites.net/announcements/Home")
    .then(response => {
      return response.json();
    })
    .then(ann => {
      $(".annBody").remove();
      $("#annTable").append('<tbody class="annBody"></tbody>');
      if (ann != undefined)
        ann.forEach(a => {
          $(".annBody").append(
            `<tr>`,
            `<td> ${a.content}</td>`,
            `<td> ${a.submitter}</td>`,
            `<td> ${a.date}</td>`,
            `</tr>`
          );
        });
    })
    .catch(err => {
      console.log(err);
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
    getAnnouncements();
  });
  $("#searchinp").on("keyup", function(){
    var value = $(this)[0].value.toLowerCase();
    console.log(value)
    $("#tableContent tr, #tableBody tr").filter(function(){
      console.log($(this).text().toLowerCase())
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
