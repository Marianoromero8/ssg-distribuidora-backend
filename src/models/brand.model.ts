import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface BrandAttributes {
  id: string;
  brandName: string;
  brandImage: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id' | 'brandImage'> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  declare id: string;
  declare brandName: string;
  declare brandImage: string | null;
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
  },
  {
    sequelize,
    tableName: 'brands',
    modelName: 'Brand',
  }
);
