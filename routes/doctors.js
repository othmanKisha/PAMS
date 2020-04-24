const express = require("express");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  postDoctor,
  createAppointment,
  editDoctor,
  deleteDoctor,
  getHome
} = require("./controllers/doctors");

// REST Routes for doctors
router.get("/", checkAuth, getDoctors);
router.get("/Home", getHome);
router.get("/new", checkAuth, (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else res.render("new", { edited: "doctor" });
});
router.get("/:id", checkAuth, getDoctorById);
router.get("/:id/edit", checkAuth, (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else res.render("edit", {});
});
router.post("/", checkAuth, postDoctor);
router.post("/:id/appointments", checkAuth, createAppointment);
router.put("/:id/edit", checkAuth, editDoctor);
router.delete("/:id", checkAuth, deleteDoctor);

module.exports = router;
