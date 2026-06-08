import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PFCategoryAttributes {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFCategoryCreationAttributes extends Optional<PFCategoryAttributes, 'id' | 'active'> {}

export class PFCategory
  extends Model<PFCategoryAttributes, PFCategoryCreationAttributes>
  implements PFCategoryAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'pf_categories',
    modelName: 'PFCategory',
  }
);
