import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Role, DocumentType } from '../shared/types/enums';

interface UserAttributes {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string | null;
  documentType: DocumentType | null;
  documentNumber: string | null;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'phone' | 'documentType' | 'documentNumber' | 'isActive'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare name: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare phone: string | null;
  declare documentType: DocumentType | null;
  declare documentNumber: string | null;
  declare role: Role;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    documentType: {
      type: DataTypes.ENUM(...Object.values(DocumentType)),
      allowNull: true,
    },
    documentNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
      defaultValue: Role.CLIENT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  }
);
