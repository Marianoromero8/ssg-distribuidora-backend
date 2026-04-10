/**
 * One-time script: sets productImage = null for any product
 * whose image URL is not a valid Cloudinary (https) URL.
 *
 * Run with:  npx ts-node src/database/fix-images.ts
 */
import '../config/env';
import { sequelize } from '../config/database';
import { registerAssociations } from './associations';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Op } from 'sequelize';

async function fixImages() {
  registerAssociations();
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  console.log('Connected.\n');

  // Products with local/broken image paths
  const badProducts = await Product.findAll({
    where: {
      productImage: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.notLike]: 'http%' },
        ],
      },
    },
  });

  console.log(`Found ${badProducts.length} products with non-Cloudinary image URLs:`);
  for (const p of badProducts) {
    console.log(`  - ${p.productName}: "${p.productImage}"`);
  }

  if (badProducts.length === 0) {
    console.log('Nothing to fix.');
    process.exit(0);
  }

  await Product.update(
    { productImage: null },
    {
      where: {
        productImage: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.notLike]: 'http%' },
          ],
        },
      },
    }
  );

  console.log(`\n✅ Cleared ${badProducts.length} invalid image URLs.`);
  console.log('   Those products now show a placeholder until you upload images from the admin.');

  // Same for brands
  const badBrands = await Brand.findAll({
    where: {
      brandImage: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.notLike]: 'http%' },
        ],
      },
    },
  });

  if (badBrands.length > 0) {
    console.log(`\nFound ${badBrands.length} brands with non-Cloudinary image URLs:`);
    for (const b of badBrands) {
      console.log(`  - ${b.brandName}: "${b.brandImage}"`);
    }
    await Brand.update(
      { brandImage: null },
      {
        where: {
          brandImage: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.notLike]: 'http%' },
            ],
          },
        },
      }
    );
    console.log(`✅ Cleared ${badBrands.length} invalid brand image URLs.`);
  }

  process.exit(0);
}

fixImages().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
