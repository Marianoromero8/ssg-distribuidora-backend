import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import type { PFOrder } from './pfOrder.model';

interface PFCustomerAttributes {
  id: string;
  dni: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  cuil: string;
  address: string;
  firstOrderAt: Date;
  lastOrderAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFCustomerCreationAttributes extends Optional<PFCustomerAttributes, 'id'> {}

export class PFCustomer
  extends Model<PFCustomerAttributes, PFCustomerCreationAttributes>
  implements PFCustomerAttributes
{
  declare id: string;
  declare dni: string;
  declare name: string;
  declare surname: string;
  declare email: string;
  declare phone: string;
  declare cuil: string;
  declare address: string;
  declare firstOrderAt: Date;
  declare lastOrderAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare orders?: PFOrder[];
}

PFCustomer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    cuil: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: '',
    },
    firstOrderAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastOrderAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pf_customers',
    modelName: 'PFCustomer',
  }
);
