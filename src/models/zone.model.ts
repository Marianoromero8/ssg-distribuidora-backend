import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ZoneAttributes {
  id: string;
  zoneName: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ZoneCreationAttributes extends Optional<ZoneAttributes, 'id' | 'isActive'> {}

export class Zone
  extends Model<ZoneAttributes, ZoneCreationAttributes>
  implements ZoneAttributes
{
  declare id: string;
  declare zoneName: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Zone.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    zoneName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'zones',
    modelName: 'Zone',
  }
);
