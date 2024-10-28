import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import imageRoutes from './routes/imageRoutes';

const PORT = process.env.PORT || 5000;

/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Image upload operations
 */

app.use('/api/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
