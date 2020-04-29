const express = require("express");
const { checkAuth, checkNotAuth } = require("./middleware/auth");
const {
  getLogin,
  login,
  getRegister,
  register,
  signout
} = require("./controllers/auth");
const router = express.Router();

router.get("/register", checkNotAuth, getRegister);
router.post("/register", (req, res) => {
  register(req, res, `/auth/register`, "patient", null);
});
router.get("/login", checkNotAuth, getLogin);
router.post("/login", login);
router.get("/signout", checkAuth, signout);

module.exports = router;
