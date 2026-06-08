import { Brand } from '../models/brand.model';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { Promotion } from '../models/promotion.model';
import { User } from '../models/user.model';
import { Zone } from '../models/zone.model';
import { UserSchedule } from '../models/userSchedule.model';
import { PFOrder } from '../models/pfOrder.model';
import { PFOrderItem } from '../models/pfOrderItem.model';
import { PFCategory } from '../models/pfCategory.model';
import { PFProduct } from '../models/pfProduct.model';

export function registerAssociations(): void {
  // Brand → Product
  Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });
  Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

  // Category → Product
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  // Category self-reference (parent → subcategories)
  Category.hasMany(Category, { foreignKey: 'parentCategoryId', as: 'subcategories' });
  Category.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parent' });

  // Product → Promotion
  Product.hasMany(Promotion, { foreignKey: 'productId', as: 'promotions' });
  Promotion.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // User → UserSchedule
  User.hasMany(UserSchedule, { foreignKey: 'userId', as: 'schedules' });
  UserSchedule.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Zone → UserSchedule
  Zone.hasMany(UserSchedule, { foreignKey: 'zoneId', as: 'schedules' });
  UserSchedule.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });

  // PFCategory → PFProduct
  PFCategory.hasMany(PFProduct, { foreignKey: 'categoryId', as: 'products' });
  PFProduct.belongsTo(PFCategory, { foreignKey: 'categoryId', as: 'category' });

  // PFOrder → PFOrderItem
  PFOrder.hasMany(PFOrderItem, { foreignKey: 'orderId', as: 'items' });
  PFOrderItem.belongsTo(PFOrder, { foreignKey: 'orderId', as: 'order' });

  // PFOrderItem → PFProduct
  PFOrderItem.belongsTo(PFProduct, { foreignKey: 'productId', as: 'product' });
  PFProduct.hasMany(PFOrderItem, { foreignKey: 'productId', as: 'orderItems' });
}
