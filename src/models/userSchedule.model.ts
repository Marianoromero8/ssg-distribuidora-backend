import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { DayOfWeek } from '../shared/types/enums';

interface UserScheduleAttributes {
  id: string;
  userId: string;
  zoneId: string;
  dayOfWeek: DayOfWeek;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserScheduleCreationAttributes extends Optional<UserScheduleAttributes, 'id'> {}

export class UserSchedule
  extends Model<UserScheduleAttributes, UserScheduleCreationAttributes>
  implements UserScheduleAttributes
{
  declare id: string;
  declare userId: string;
  declare zoneId: string;
  declare dayOfWeek: DayOfWeek;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserSchedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.ENUM(...Object.values(DayOfWeek)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_schedules',
    modelName: 'UserSchedule',
  }
);
