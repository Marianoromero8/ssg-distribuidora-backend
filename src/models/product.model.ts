import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { ContentUnit } from '../shared/types/enums';

interface ProductAttributes {
  id: string;
  productName: string;
  productImage: string | null;
  brandId: string;
  categoryId: string;
  price: number;
  contentValue: number;
  contentUnit: ContentUnit;
  packQuantity: number;
  stock: number;
  available: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    'id' | 'productImage' | 'stock' | 'available' | 'isFeatured'
  > {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: string;
  declare productName: string;
  declare productImage: string | null;
  declare brandId: string;
  declare categoryId: string;
  declare price: number;
  declare contentValue: number;
  declare contentUnit: ContentUnit;
  declare packQuantity: number;
  declare stock: number;
  declare available: boolean;
  declare isFeatured: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    contentValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    contentUnit: {
      type: DataTypes.ENUM(...Object.values(ContentUnit)),
      allowNull: false,
    },
    packQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
  }
);
