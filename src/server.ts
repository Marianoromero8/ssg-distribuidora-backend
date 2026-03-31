import { env } from './config/env';
import { sequelize, connectDB } from './config/database';
import { registerAssociations } from './database/associations';
import app from './app';

async function bootstrap() {
  registerAssociations();
  await connectDB();

  await sequelize.sync({ alter: true });
  console.log('Database synced.');

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
