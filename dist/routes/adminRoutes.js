"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = __importDefault(require("../middleware/auth"));
const adminAuth_1 = __importDefault(require("../middleware/adminAuth"));
const router = express_1.default.Router();
// Apply auth and adminAuth middleware to all admin routes
router.use(auth_1.default, adminAuth_1.default);
// User management routes
router.get('/users', adminController_1.getAllUsers);
router.put('/users/:id/role', adminController_1.updateUserRole);
router.delete('/users/:id', adminController_1.deleteUser);
// Product management routes
router.get('/products', adminController_1.getAllProducts);
router.put('/products/:id', adminController_1.updateProduct);
router.delete('/products/:id', adminController_1.deleteProduct);
// Dashboard statistics route
router.get('/dashboard-stats', adminController_1.getDashboardStats);
// Add more admin routes as needed
exports.default = router;
