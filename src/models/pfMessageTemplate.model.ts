import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PFMessageTemplateAttributes {
  id: string;
  key: string;
  label: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFMessageTemplateCreationAttributes extends Optional<PFMessageTemplateAttributes, 'id'> {}

export class PFMessageTemplate
  extends Model<PFMessageTemplateAttributes, PFMessageTemplateCreationAttributes>
  implements PFMessageTemplateAttributes
{
  declare id: string;
  declare key: string;
  declare label: string;
  declare body: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFMessageTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pf_message_templates',
    modelName: 'PFMessageTemplate',
  }
);
