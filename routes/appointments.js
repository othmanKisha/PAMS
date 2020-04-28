const express = require("express");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();
const {
  getAppointments,
  getConfirmedAppointments,
  getAppointmentById,
  editAppointment,
  deleteAppointment
} = require("./controllers/appointments");

// REST routes for appointments
router.get("/", checkAuth, getAppointments);
router.get("/confirmed", checkAuth, getConfirmedAppointments);
router.get("/:id", checkAuth, getAppointmentById);
router.put("/:id", checkAuth, editAppointment);
router.delete("/:id", checkAuth, deleteAppointment);

module.exports = router;
