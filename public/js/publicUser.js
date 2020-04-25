var clnc = true;
var dctr = false;
var clinics, doctors;

const viewClinics = () => {
  fetch("http://localhost:3000/clinics/Home")
    .then(response => {
      return response.json();
    })
    .then(cs => {
      $("#tableHead").remove();
      $("#tableBody").remove();
      $("#tableMain").append(
        '<thead class="thead-dark" id="tableHead"></thead><tbody id="tableBody"></tbody>'
      );
      var h1 = $("<th scope='col'></th>").text("Name");
      var h2 = $("<th scope='col'></th>").text("Profile");
      var h3 = $("<th scope='col'></th>").text("Servics");
      var h4 = $("<th scope='col'></th>").text("Rating");
      $("#tableHead").append(h1, h2, h3, h4);
      if (cs != undefined)
        cs.forEach(c => {
          $("#tableBody").append(`<tr id="trow${c._id}">`);
          if (c.rating <= 0)
            $(`#trow${c._id}`).append(
              `<td><a href="/auth/login">${c.name}</a></td>`,
              `<td><a href="/auth/login">${c.profile}</a></td>`,
              `<td><a href="/auth/login">${c.services}</a></td>`,
              `<td><a href="/auth/login"> There is no rating yet. </a></td>`
            );
          else {
            $(`#trow${c._id}`).append(
              `<td><a href="/auth/login">${c.name}</a></td>`,
              `<td><a href="/auth/login">${c.profile}</a></td>`,
              `<td><a href="/auth/login">${c.services}</a></td>`,
              `<td><a href="/auth/login" id="tcol"></a></td>`
            );
            for (i = 0; i < c.rating; i++) {
              if (c.rating - i > 0.75) {
                $("#tcol").append(
                  `<i class="fa fa-star checked w3-xlarge"></i>`
                );
              } else if (c.rating - i <= 0.75 && c.rating - i >= 0.25) {
                $("#tcol").append(
                  `<i class="fa fa-star-half checked w3-xlarge"></i>`
                );
              }
            }
            $("#tcol").append(` ${c.rating} </tr>`);
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
};

const viewDoctors = () => {
  fetch("http://localhost:3000/doctors/Home")
    .then(response => {
      return response.json();
    })
    .then(ds => {
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
      $("#tableHead").append(h1, h2, h3, h4, h5);
      if (ds != undefined)
        ds.forEach(d => {
          $("#tableBody").append(`<tr id="trow${d._id}">`);
          if (d.rating <= 0)
            $(`#trow${d._id}`).append(
              `<td><a href="/auth/login">Dr. ${d.lname} ${d.fname}</a></td>`,
              `<td><a href="/auth/login">${d.profile}</a></td>`,
              `<td><a href="/auth/login">${d.speciality}</a></td>`,
              `<td><a href="/auth/login">${d.experience} years </a></td>`,
              `<td><a href="/auth/login"> There is no rating yet. </a></td>`
            );
          else {
            $(`#trow${d._id}`).append(
              `<td><a href="/auth/login">Dr. ${d.lname} ${d.fname}</a></td>`,
              `<td><a href="/auth/login">${d.profile}</a></td>`,
              `<td><a href="/auth/login">${d.speciality}</a></td>`,
              `<td><a href="/auth/login">${d.experience} years</a></td>`,
              `<td><a href="/auth/login" id="tcol"></a></td>`
            );
            for (i = 0; i < d.rating; i++) {
              if (d.rating > i + 0.75) {
                $("#tcol").append(
                  `<i class="fa fa-star checked w3-xlarge"></i>`
                );
              } else if (d.rating <= i + 0.75 && d.rating >= i + 0.25) {
                $("#tcol").append(
                  `<i class="fa fa-star-half checked w3-xlarge"></i>`
                );
              }
            }
            $("#tcol").append(` ${d.rating} </tr>`);
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
};

$(document).ready(() => {
  $("#clncs").on("click", () => {
    $("#dctrs").removeClass("active");
    $("#clncs").addClass("active");
    clnc = true;
    dctr = false;
    viewClinics();
  });

  $("#dctrs").on("click", () => {
    $("#dctrs").addClass("active");
    $("#clncs").removeClass("active");
    dctr = true;
    clnc = false;
    viewDoctors();
  });

  viewClinics();
});
