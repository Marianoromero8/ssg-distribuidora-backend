import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum PFAnnouncementType {
  POPUP = 'POPUP',
  CAROUSEL = 'CAROUSEL',
}

interface PFAnnouncementAttributes {
  id: string;
  type: PFAnnouncementType;
  imageUrl: string;
  title: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PFAnnouncementCreationAttributes extends Optional<
  PFAnnouncementAttributes,
  'id' | 'title' | 'isActive' | 'displayOrder'
> {}

export class PFAnnouncement
  extends Model<PFAnnouncementAttributes, PFAnnouncementCreationAttributes>
  implements PFAnnouncementAttributes
{
  declare id: string;
  declare type: PFAnnouncementType;
  declare imageUrl: string;
  declare title: string | null;
  declare isActive: boolean;
  declare displayOrder: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PFAnnouncement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PFAnnouncementType)),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'pf_announcements',
    modelName: 'PFAnnouncement',
  }
);
