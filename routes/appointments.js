const express = require("express");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();
const {
  getAppointments,
  getFinishedAppointments,
  getAppointmentById,
  deleteAppointment
} = require("./controllers/appointments");

// REST routes for appointments
router.get("/", checkAuth, getAppointments);
router.get("/finished", checkAuth, getFinishedAppointments);
router.get("/:id", checkAuth, getAppointmentById);
router.put("/:id", checkAuth, require("./controllers/evaluation"));
router.delete("/:id", checkAuth, deleteAppointment);

module.exports = router;
