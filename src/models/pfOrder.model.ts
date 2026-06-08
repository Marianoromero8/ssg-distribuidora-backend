import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { PFOrderStatus } from '../shared/types/enums';

interface PFOrderAttributes {
  id: string;
  clientName: string;
  clientSurname: string;
  clientEmail: string;
  clientPhone: string;
  clientDni: string;
  clientCuil: string;
  clientAddress: string;
  total: number;
  status: PFOrderStatus;
  note: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFOrderCreationAttributes
  extends Optional<PFOrderAttributes, 'id' | 'note' | 'status'> {}

export class PFOrder
  extends Model<PFOrderAttributes, PFOrderCreationAttributes>
  implements PFOrderAttributes
{
  declare id: string;
  declare clientName: string;
  declare clientSurname: string;
  declare clientEmail: string;
  declare clientPhone: string;
  declare clientDni: string;
  declare clientCuil: string;
  declare clientAddress: string;
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
    clientSurname: {
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
    clientDni: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    clientCuil: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    clientAddress: {
      type: DataTypes.STRING(300),
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
