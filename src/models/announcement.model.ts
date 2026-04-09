import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AnnouncementAttributes {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AnnouncementCreationAttributes
  extends Optional<AnnouncementAttributes, 'id' | 'title' | 'description' | 'isActive'> {}

export class Announcement
  extends Model<AnnouncementAttributes, AnnouncementCreationAttributes>
  implements AnnouncementAttributes
{
  declare id: string;
  declare title: string | null;
  declare description: string | null;
  declare imageUrl: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Announcement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'announcements',
    modelName: 'Announcement',
  }
);
