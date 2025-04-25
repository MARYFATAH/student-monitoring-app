export function allowForRoles(allowedRoles) {
  return (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role } = req.auth;

    if (role === "admin" || allowedRoles.includes(role)) {
      next();
    }
    return res.status(403).json({ error: "Forbidden" });
  };
}
