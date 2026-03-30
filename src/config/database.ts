import { Sequelize } from 'sequelize';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

export const sequelize = env.DATABASE_URL
  ? new Sequelize(env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      define: {
        underscored: true,
        timestamps: true,
      },
    })
  : new Sequelize({
      dialect: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      logging: isProduction ? false : console.log,
      define: {
        underscored: true,
        timestamps: true,
      },
    });

export async function connectDB(): Promise<void> {
  await sequelize.authenticate();
  console.log('Database connection established.');
}
