const express = require("express");
const { checkAuth } = require("./middleware/auth");
const router = express.Router();
const {
  getAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  getHome
} = require("./controllers/announcements");

// REST routes for announcements
router.get("/", checkAuth, getAnnouncements);
router.delete("/:id", checkAuth, deleteAnnouncement);
router.post("/", checkAuth, createAnnouncement);
router.get("/Home", getHome);

module.exports = router;
