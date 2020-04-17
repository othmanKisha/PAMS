//Checking logic
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

const checkNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};

module.exports = { checkAuth, checkNotAuth };
