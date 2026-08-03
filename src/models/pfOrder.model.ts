import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { PFOrderStatus, PFDeliveryMethod } from '../shared/types/enums';
import type { PFOrderItem } from './pfOrderItem.model';
import type { PFCustomer } from './pfCustomer.model';

interface PFOrderAttributes {
  id: string;
  orderNumber: number;
  customerId: string | null;
  clientName: string;
  clientSurname: string;
  clientEmail: string;
  clientPhone: string;
  clientDni: string;
  clientCuil: string;
  clientAddress: string;
  deliveryMethod: PFDeliveryMethod;
  total: number;
  status: PFOrderStatus;
  note: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFOrderCreationAttributes
  extends Optional<PFOrderAttributes, 'id' | 'note' | 'status' | 'orderNumber' | 'customerId'> {}

export class PFOrder
  extends Model<PFOrderAttributes, PFOrderCreationAttributes>
  implements PFOrderAttributes
{
  declare id: string;
  declare orderNumber: number;
  declare customerId: string | null;
  declare clientName: string;
  declare clientSurname: string;
  declare clientEmail: string;
  declare clientPhone: string;
  declare clientDni: string;
  declare clientCuil: string;
  declare clientAddress: string;
  declare deliveryMethod: PFDeliveryMethod;
  declare total: number;
  declare status: PFOrderStatus;
  declare note: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare items?: PFOrderItem[];
  declare customer?: PFCustomer;
}

PFOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      // Nullable at the Sequelize level on purpose, so sync({ alter: true })
      // can add this column to an already-populated table without failing.
      // The real NOT NULL constraint is applied at the Postgres level after
      // the one-time backfill (see PFOrderRepository.bootstrapOrderNumberSequence).
      allowNull: true,
      unique: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    clientName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    clientSurname: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    clientEmail: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    clientPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    clientDni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
    clientCuil: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
    clientAddress: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: '',
    },
    deliveryMethod: {
      type: DataTypes.ENUM(...Object.values(PFDeliveryMethod)),
      allowNull: false,
      defaultValue: PFDeliveryMethod.DELIVERY,
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
