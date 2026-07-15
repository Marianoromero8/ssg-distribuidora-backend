import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PFSettingsAttributes {
  id: string;
  accountHolderName: string;
  cuil: string;
  alias: string;
  cbu: string;
  phone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFSettingsCreationAttributes extends Optional<PFSettingsAttributes, 'id'> {}

export class PFSettings
  extends Model<PFSettingsAttributes, PFSettingsCreationAttributes>
  implements PFSettingsAttributes
{
  declare id: string;
  declare accountHolderName: string;
  declare cuil: string;
  declare alias: string;
  declare cbu: string;
  declare phone: string;
  declare address: string;
  declare instagramUrl: string;
  declare facebookUrl: string;
  declare whatsappUrl: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    cuil: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    cbu: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    instagramUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    facebookUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    whatsappUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    sequelize,
    tableName: 'pf_settings',
    modelName: 'PFSettings',
  }
);
