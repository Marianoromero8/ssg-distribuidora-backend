import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import brandRoutes from './routes/brand.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import promotionRoutes from './routes/promotion.routes';
import bannerRoutes from './routes/banner.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/banners', bannerRoutes);

app.use(errorHandler);

export default app;
