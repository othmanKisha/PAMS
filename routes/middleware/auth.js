//Checking logic
export const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

export const checkNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};
