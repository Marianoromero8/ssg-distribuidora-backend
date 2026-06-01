import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { PFOrderStatus } from '../shared/types/enums';

interface PFOrderAttributes {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  total: number;
  status: PFOrderStatus;
  note: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFOrderCreationAttributes extends Optional<PFOrderAttributes, 'id' | 'note' | 'status'> {}

export class PFOrder
  extends Model<PFOrderAttributes, PFOrderCreationAttributes>
  implements PFOrderAttributes
{
  declare id: string;
  declare clientName: string;
  declare clientEmail: string;
  declare clientPhone: string;
  declare total: number;
  declare status: PFOrderStatus;
  declare note: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    clientEmail: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    clientPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PFOrderStatus)),
      allowNull: false,
      defaultValue: PFOrderStatus.PENDING,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'pf_orders',
    modelName: 'PFOrder',
  }
);
