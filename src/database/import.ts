import path from 'path';
import fs from 'fs';
import '../config/env';
import { sequelize } from '../config/database';
import { registerAssociations } from './associations';
import { Brand } from '../models/brand.model';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { ContentUnit } from '../shared/types/enums';

// ── Path to the frontend products.json ──────────────────────────────────────
// From src/database → up 4 levels to OneDrive → into Mariano/ssg-distribuidora
const JSON_PATH = path.resolve(
  __dirname,
  '../../../../Mariano/ssg-distribuidora/public/data/products.json'
);

// ── Category tree from the frontend ─────────────────────────────────────────
const CATEGORY_TREE: Record<string, string[]> = {
  congelados: ['papas fritas', 'hamburguesas', 'frutas', 'verduras'],
  refrigerados: ['aderezos', 'lacteos', 'quesos', 'fiambres', 'salchichas'],
  secos: ['yerba mate', 'panes', 'food service'],
};

// ── Parse "Caja x 5kg", "250 GR", "1 x 10u", "3.5 KG", "5 L" etc. ─────────
function parsePresentation(text: string): {
  contentValue: number;
  contentUnit: ContentUnit;
  packQuantity: number;
} {
  const t = text.trim();

  // Pattern: "N x Mu" or "N x M u" — e.g. "1 x 10u", "1 x 168u"
  const packMatch = t.match(/^(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*(u|un|kg|gr|ml|l|lts)?$/i);
  if (packMatch) {
    return {
      contentValue: parseFloat(packMatch[1]),
      contentUnit: mapUnit(packMatch[3] || 'un'),
      packQuantity: parseInt(packMatch[2]),
    };
  }

  // Pattern: "Caja x 5kg", "Bolsa x 2.5kg" — word prefix before x
  const boxMatch = t.match(/^\w+\s+[xX]\s*(\d+(?:\.\d+)?)\s*(kg|gr|ml|l|lts|u|un)/i);
  if (boxMatch) {
    return {
      contentValue: parseFloat(boxMatch[1]),
      contentUnit: mapUnit(boxMatch[2]),
      packQuantity: 1,
    };
  }

  // Pattern: "5 L", "250 GR", "3.5 KG", "500 ML"
  const simpleMatch = t.match(/^(\d+(?:\.\d+)?)\s*(kg|gr|ml|l|lts|u|un)/i);
  if (simpleMatch) {
    return {
      contentValue: parseFloat(simpleMatch[1]),
      contentUnit: mapUnit(simpleMatch[2]),
      packQuantity: 1,
    };
  }

  console.warn(`  ⚠ Could not parse presentation: "${text}" — using defaults`);
  return { contentValue: 1, contentUnit: ContentUnit.UN, packQuantity: 1 };
}

function mapUnit(raw: string): ContentUnit {
  switch (raw.toLowerCase()) {
    case 'kg':  return ContentUnit.KG;
    case 'gr':  return ContentUnit.GR;
    case 'ml':  return ContentUnit.ML;
    case 'l':
    case 'lts': return ContentUnit.LTS;
    default:    return ContentUnit.UN;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function importData() {
  registerAssociations();
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  console.log('Connected to database.\n');

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`JSON not found at: ${JSON_PATH}`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8')) as Array<{
    id: number;
    src: string;
    brand: string;
    website?: string;
    products: Array<{
      id: number;
      image: string;
      productName: string;
      presentation: string;
      category: string;
      subcategory: string;
    }>;
  }>;

  // ── 1. Categories ──────────────────────────────────────────────────────────
  console.log('📂 Creating categories...');
  const categoryMap = new Map<string, string>(); // name → id

  for (const [rootName, subcats] of Object.entries(CATEGORY_TREE)) {
    const [root] = await Category.findOrCreate({
      where: { categoryName: rootName, parentCategoryId: null },
      defaults: { categoryName: rootName },
    });
    categoryMap.set(rootName, root.id);
    console.log(`  ✓ ${rootName}`);

    for (const subName of subcats) {
      const [sub] = await Category.findOrCreate({
        where: { categoryName: subName, parentCategoryId: root.id },
        defaults: { categoryName: subName, parentCategoryId: root.id },
      });
      categoryMap.set(subName, sub.id);
      console.log(`    ✓ ${subName}`);
    }
  }

  // ── 2. Brands & Products ───────────────────────────────────────────────────
  console.log('\n🏷️  Creating brands and products...');

  for (const entry of rawData) {
    const [brand] = await Brand.findOrCreate({
      where: { brandName: entry.brand },
      defaults: {
        brandName: entry.brand,
        brandImage: entry.src ?? null,
      },
    });
    console.log(`\n  Brand: ${brand.brandName}`);

    for (const p of entry.products) {
      const categoryId = categoryMap.get(p.subcategory);
      if (!categoryId) {
        console.warn(`    ⚠ Unknown subcategory "${p.subcategory}" for "${p.productName}" — skipping`);
        continue;
      }

      const { contentValue, contentUnit, packQuantity } = parsePresentation(p.presentation);

      await Product.findOrCreate({
        where: { productName: p.productName, brandId: brand.id },
        defaults: {
          productName: p.productName,
          productImage: p.image ?? null,
          brandId: brand.id,
          categoryId,
          price: 0,
          contentValue,
          contentUnit,
          packQuantity,
          stock: 0,
          available: true,
          isFeatured: false,
        },
      });
      console.log(`    ✓ ${p.productName} (${p.presentation})`);
    }
  }

  console.log('\n✅ Import complete!');
  console.log('ℹ️  Prices and stock are set to 0 — update them from the admin dashboard.');
  process.exit(0);
}

importData().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
