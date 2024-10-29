import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import axios from 'axios';

const router = express.Router();
const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

/**
 * @swagger
 * components:
 *   schemas:
 *     GoogleAuthRequest:
 *       type: object
 *       required:
 *         - access_token
 *       properties:
 *         access_token:
 *           type: string
 *           description: Google OAuth2 access token obtained from frontend Google Sign-In
 *           example: "ya29.a0AfB_byC..."
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authentication with our API
 *           example: "eyJhbGciOiJIUzI1NiIs..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: User's unique identifier
 *               example: "507f1f77bcf86cd799439011"
 *             email:
 *               type: string
 *               format: email
 *               description: User's email address
 *               example: "user@example.com"
 *             name:
 *               type: string
 *               description: User's full name
 *               example: "John Doe"
 *             role:
 *               type: string
 *               enum: [user, admin, seller]
 *               description: User's role in the system
 *               example: "user"
 *             avatar:
 *               type: string
 *               format: uri
 *               description: URL to user's profile picture
 *               example: "https://lh3.googleusercontent.com/a/..."
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: string
 *           description: Detailed error information (only in development)
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate user with Google OAuth2
 *     description: |
 *       Authenticates a user using Google OAuth2 access token.
 *       - If user doesn't exist, creates a new user account
 *       - If user exists, updates their information
 *       - Returns JWT token and user information
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleAuthRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request - missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No access_token provided"
 *       401:
 *         description: Authentication failed - invalid token or missing email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Email not found in Google profile"
 *       500:
 *         description: Server error during authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Authentication failed"
 *               error: "Token validation failed"
 */

router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: 'No access_token provided' });
    }

    // Get user info using access token
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const { 
      sub: googleId,
      email,
      name,
      picture: avatar 
    } = userInfoResponse.data;

    if (!email) {
      return res.status(401).json({ message: 'Email not found in Google profile' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        provider: 'google',
        email,
        name: name || email.split('@')[0],
        googleId,
        role: 'user',
        avatar
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Return token and user info
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Google API response:', error.response?.data);
    }
    res.status(500).json({ 
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
