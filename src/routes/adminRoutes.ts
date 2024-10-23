import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getDashboardStats
} from '../controllers/adminController';
import auth from '../middleware/auth';
import adminAuth from '../middleware/adminAuth';

const router = express.Router();

// Apply auth and adminAuth middleware to all admin routes
router.use(auth as express.RequestHandler, adminAuth as express.RequestHandler);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product management routes
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Dashboard statistics route
router.get('/dashboard-stats', getDashboardStats);

// Add more admin routes as needed

export default router;
