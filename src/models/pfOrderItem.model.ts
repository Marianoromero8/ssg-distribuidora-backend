import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PFOrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFOrderItemCreationAttributes extends Optional<PFOrderItemAttributes, 'id'> {}

export class PFOrderItem
  extends Model<PFOrderItemAttributes, PFOrderItemCreationAttributes>
  implements PFOrderItemAttributes
{
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare unitPrice: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFOrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pf_order_items',
    modelName: 'PFOrderItem',
  }
);
