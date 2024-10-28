import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { Request, Response } from 'express';

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload an image to ImgBB
 *     tags: [Images]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *       400:
 *         description: Invalid request or upload failed
 */
router.post('/upload', upload.single('image'), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }
        const formData = new FormData();
        formData.append('image', req.file.buffer.toString('base64'));

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData);

        if (response.data.success) {
            return res.json({
                success: true,
                url: response.data.data.url
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to upload image'
            });
        }
    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router;
