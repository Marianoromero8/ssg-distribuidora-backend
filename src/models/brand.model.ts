import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface BrandAttributes {
  id: string;
  brandName: string;
  brandImage: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id' | 'brandImage' | 'isActive'> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  declare id: string;
  declare brandName: string;
  declare brandImage: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Brand.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    brandName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    brandImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'brands',
    modelName: 'Brand',
  }
);
