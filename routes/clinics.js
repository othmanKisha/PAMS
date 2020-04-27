const express = require("express");
const { checkAuth } = require("./middleware/auth");
const {
  getClinics,
  getHome,
  getNewPage,
  getClinicById,
  getNewManagerPage,
  getNewReceptionistPage,
  postClinic,
  postManager,
  postReceptionist,
  editClinic,
  deleteClinic
} = require("./controllers/clinics");
const router = express.Router();

// REST Routes for clinics
router.get("/", checkAuth, getClinics);
router.get("/Home", getHome);
router.get("/new", checkAuth, getNewPage);
router.get("/:id", checkAuth, getClinicById);
router.get("/:id/manager/new", checkAuth, getNewManagerPage);
router.get("/:id/receptionist/new", checkAuth, getNewReceptionistPage);
router.post("/", checkAuth, postClinic);
router.post("/:id/manager", checkAuth, postManager);
router.post("/:id/receptionist", checkAuth, postReceptionist);
router.put("/:id/edit", checkAuth, editClinic);
router.delete("/:id", checkAuth, deleteClinic);

module.exports = router;
