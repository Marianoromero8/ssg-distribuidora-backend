import '../config/env';
import { sequelize } from '../config/database';
import { registerAssociations } from './associations';
import { User } from '../models/user.model';
import { hashPassword } from '../shared/utils/hash';
import { Role } from '../shared/types/enums';

async function seed() {
  registerAssociations();
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });

  const existing = await User.findOne({ where: { email: 'admin@ssg.com' } });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const password = await hashPassword('Admin1234!');
  await User.create({
    name: 'Admin',
    lastname: 'SSG',
    email: 'admin@ssg.com',
    password,
    role: Role.ADMIN,
  });

  console.log('✓ Admin user created: admin@ssg.com / Admin1234!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
