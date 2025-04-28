export function allowForRoles(allowedRoles) {
  return (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role } = req.auth;
    console.log("User role:", role);

    if (role === "admin" || allowedRoles.includes(role)) {
      return next();
    }
    console.log("User role:", role);
    return res.status(403).json({ error: "Forbidden" });
  };
}
