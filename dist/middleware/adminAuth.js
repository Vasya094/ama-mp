"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === User_1.UserRole.ADMIN) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
};
exports.default = adminAuth;
