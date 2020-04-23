const express = require("express");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getNewPage,
  postDoctor,
  createAppointment,
  getEditPage,
  editDoctor,
  deleteDoctor,
  getHome
} = require("./controllers/doctors");

// REST Routes for doctors
router.get("/", checkAuth, getDoctors);
router.get("/Home", getHome);
router.get("/new", checkAuth, getNewPage);
router.get("/:id", checkAuth, getDoctorById);
router.get("/:id/edit", checkAuth, getEditPage);
router.post("/", checkAuth, postDoctor);
router.post("/:id/appointments", checkAuth, createAppointment);
router.put("/:id/edit", checkAuth, editDoctor);
router.delete("/:id", checkAuth, deleteDoctor);

module.exports = router;
