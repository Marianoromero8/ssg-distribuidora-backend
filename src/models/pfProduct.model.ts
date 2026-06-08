import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PFProductAttributes {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  stock: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFProductCreationAttributes
  extends Optional<PFProductAttributes, 'id' | 'description' | 'imageUrl' | 'stock' | 'active'> {}

export class PFProduct
  extends Model<PFProductAttributes, PFProductCreationAttributes>
  implements PFProductAttributes
{
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare imageUrl: string | null;
  declare categoryId: string;
  declare stock: number;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'pf_products',
    modelName: 'PFProduct',
  }
);
