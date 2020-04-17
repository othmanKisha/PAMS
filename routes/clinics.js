const express = require("express");
const { checkAuth } = require("./middleware/auth");
const {
  getClinics,
  getClinicById,
  getNewPage,
  getNewManager,
  getNewReceptionist,
  getEditPage,
  getHome,
  postClinic,
  registerManager,
  registerReceptionist,
  editClinic,
  deleteClinic
} = require("./controllers/clinics");
const router = express.Router();

// REST Routes for clinics
router.get("/", checkAuth, getClinics);
router.get("/Home", getHome);
router.get("/new", checkAuth, getNewPage);
router.get("/:id", checkAuth, getClinicById);
router.get("/:id/edit", checkAuth, getEditPage);
router.get("/:id/manager/new", checkAuth, getNewManager);
router.get("/:id/receptionist/new", checkAuth, getNewReceptionist);
router.post("/", checkAuth, postClinic);
router.post("/:id/manager", checkAuth, registerManager);
router.post("/:id/receptionist", checkAuth, registerReceptionist);
router.put("/:id/edit", checkAuth, editClinic);
router.delete("/:id", checkAuth, deleteClinic);

module.exports = router;
