import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { DiscountType } from '../shared/types/enums';

interface PromotionAttributes {
  id: string;
  productId: string;
  title: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PromotionCreationAttributes extends Optional<PromotionAttributes, 'id' | 'isActive'> {}

export class Promotion
  extends Model<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  declare id: string;
  declare productId: string;
  declare title: string;
  declare discountType: DiscountType;
  declare discountValue: number;
  declare startsAt: Date;
  declare endsAt: Date;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Promotion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    discountType: {
      type: DataTypes.ENUM(...Object.values(DiscountType)),
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'promotions',
    modelName: 'Promotion',
  }
);
