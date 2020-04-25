const express = require("express");
const { checkAuth } = require("./middleware/auth");
const {
  getClinics,
  getHome,
  getClinicById,
  postClinic,
  editClinic,
  deleteClinic
} = require("./controllers/clinics");
const router = express.Router();

// REST Routes for clinics
router.get("/", checkAuth, getClinics);
router.get("/Home", getHome);
router.get("/new", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else res.render("new", { edited: "clinics" });
});
router.get("/:id", checkAuth, getClinicById);
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
router.get("/:id/manager/new", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    res.render("register", {
      e_msg: "",
      expand: false,
      route: `/clinics/${req.params.id}/manager`,
      type: "manager",
      id: req.params.id
    });
});
router.get("/:id/receptionist/new", checkAuth, (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    res.render("register", {
      e_msg: "",
      expand: false,
      route: `/clinics/${req.params.id}/receptionist`,
      type: "receptionist",
      id: req.params.id
    });
});
router.post("/", checkAuth, postClinic);
router.post("/:id/manager", checkAuth, (req, res) => {
  if (req.user.type != "admin")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    require("./controllers/registeration")(
      req,
      res,
      `/clinics/${req.params.id}/manager`,
      "manager",
      req.params.id
    );
});
router.post("/:id/receptionist", checkAuth, (req, res) => {
  if (req.user.type != "manager")
    res.render("error", {
      error: "Error: You are not autherized.",
      title: "Error",
      page_type: "show",
      base: "/users/profile",
      base_page: "Profile"
    });
  else
    require("./controllers/registeration")(
      req,
      res,
      `/clinics/${req.params.id}/receptionist`,
      "receptionist",
      req.params.id
    );
});
router.put("/:id/edit", checkAuth, editClinic);
router.delete("/:id", checkAuth, deleteClinic);

module.exports = router;
