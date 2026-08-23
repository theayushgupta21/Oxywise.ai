import { verifyToken } from "../utils/tokenUtils.js";

export function protect(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
}
