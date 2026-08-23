import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/tokenUtils.js";
import { verifyGoogleToken } from "../services/googleAuthService.js";

export async function signup(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, authProvider: "local" });

        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (err) {
        next(err);
    }
}

export async function googleAuth(req, res, next) {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Google ID token is required" });
        }

        const profile = await verifyGoogleToken(idToken);

        let user = await User.findOne({ email: profile.email });

        if (!user) {
            user = await User.create({
                name: profile.name,
                email: profile.email,
                googleId: profile.googleId,
                authProvider: "google",
                avatar: profile.avatar,
            });
        } else if (!user.googleId) {
            user.googleId = profile.googleId;
            user.avatar = user.avatar || profile.avatar;
            await user.save();
        }

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (err) {
        next(err);
    }
}

// 👇 ye function missing tha — ab add kar diya
export async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch (err) {
        next(err);
    }
}