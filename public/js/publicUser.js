var clnc = true;
var dctr = false;
var clinics, doctors;

fetch("http://localhost:3000/clinics/Home")
  .then(response => {
    return response.json();
  })
  .then(data => {
    clinics = data;
  })
  .catch(err => {
    console.log(err);
  });

fetch("http://localhost:3000/doctors/Home")
  .then(response => {
    return response.json();
  })
  .then(data => {
    doctors = data;
  })
  .catch(err => {
    console.log(err);
  });

const viewClinics = cs => {
  $("#tableHead").remove();
  $("#tableBody").remove();
  $("#tableMain").append(
    '<thead class="thead-dark" id="tableHead"></thead><tbody id="tableBody"></tbody>'
  );
  var h1 = $("<th scope='col'></th>").text("Name");
  var h2 = $("<th scope='col'></th>").text("Profile");
  var h3 = $("<th scope='col'></th>").text("Servics");
  var h4 = $("<th scope='col'></th>").text("Rating");
  $("#tableHead").append("<tr>", h1, h2, h3, h4, "</tr>");
  if (cs != undefined)
    cs.forEach(c => {
      $("#tableBody").append(
        `<tr>`,
        `<td><a href="/auth/login">${c.name}</a></td>`,
        `<td><a href="/auth/login">${c.profile}</a></td>`,
        `<td><a href="/auth/login">${c.services}</a></td>`,
        `<td><a href="/auth/login">${c.rating}</a></td>`,
        `</tr>`
      );
    });
};

const viewDoctors = ds => {
  $("#tableHead").remove();
  $("#tableBody").remove();
  $("#tableMain").append(
    '<thead class="thead-dark" id="tableHead"></thead><tbody id="tableBody"></tbody>'
  );
  var h1 = $("<th scope='col'></th>").text("Name");
  var h2 = $("<th scope='col'></th>").text("Profile");
  var h3 = $("<th scope='col'></th>").text("Speciality");
  var h4 = $("<th scope='col'></th>").text("Experience");
  var h5 = $("<th scope='col'></th>").text("Rating");
  $("#tableHead").append("<tr>", h1, h2, h3, h4, h5, "</tr>");
  ds.forEach(d => {
    $("#tableBody").append(
      `<tr>`,
      `<td><a href="/auth/login">${d.lname} ${d.fname}</a></td>`,
      `<td><a href="/auth/login">${d.profile}</a></td>`,
      `<td><a href="/auth/login">${d.speciality}</a></td>`,
      `<td><a href="/auth/login">${d.experience}</a></td>`,
      `<td><a href="/auth/login">${d.rating}</a></td>`,
      `</tr>`
    );
  });
};

$(document).ready(() => {
  $("#clncs").on("click", () => {
    $("#dctrs").removeClass("active");
    $("#clncs").addClass("active");
    clnc = true;
    dctr = false;
    viewClinics(clinics);
  });

  $("#dctrs").on("click", () => {
    $("#dctrs").addClass("active");
    $("#clncs").removeClass("active");
    dctr = true;
    clnc = false;
    viewDoctors(doctors);
  });

  viewClinics(clinics);
});
