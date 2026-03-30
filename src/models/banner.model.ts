import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

interface BannerAttributes {
  id: string;
  title: string | null;
  mediaUrl: string;
  mediaType: MediaType;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BannerCreationAttributes
  extends Optional<BannerAttributes, 'id' | 'title' | 'displayOrder' | 'isActive'> {}

export class Banner
  extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  declare id: string;
  declare title: string | null;
  declare mediaUrl: string;
  declare mediaType: MediaType;
  declare displayOrder: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Banner.init(
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
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM(...Object.values(MediaType)),
      allowNull: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'banners',
    modelName: 'Banner',
  }
);
