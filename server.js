const express = require("express");
const passport = require("passport");

const app = express()
  .set("view engine", "ejs")
  .use(require("method-override")("_method"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use(
    require("express-session")({
      secret: "HW4",
      resave: true,
      saveUninitialized: false
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Config DataBase and Passport auth
require("./config/database")(require("mongoose"));
require("./config/passport")(passport);

// REST Routes
app.get("/", (req, res) => {
  if (req.isAuthenticated())
    if (req.user.type == "patient" || req.user.type == "admin")
      res.redirect("/clinics");
    else if (req.user.type == "receptionist") res.redirect("/appointments");
    else if (req.user.type == "manager")
      res.redirect(`/clinics/${req.user.clinic_id}`);
    else
      res.render("error", {
        error: "Unauthorized user type!",
        title: "Error",
        page_type: "show",
        base: "/auth/login",
        base_page: `<i class="fa fa-sign-in w3-large"></i> Login`
      });
  else res.sendFile(__dirname + "/public/home.html");
});
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/clinics", require("./routes/clinics"));
app.use("/doctors", require("./routes/doctors"));
app.use("/appointments", require("./routes/appointments"));
app.use("/announcements", require("./routes/announcements"));

//Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
