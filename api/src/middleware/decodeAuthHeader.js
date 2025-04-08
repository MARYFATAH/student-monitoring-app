export function decodeAuthHeader(req, res, next) {
  console.log(req.headers.authorization);
  req.auth = { userId: req.headers.authorization };
  return next();
}

export function requireAuth(req, res, next) {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}
