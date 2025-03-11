import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Permission extends Model {}

  Permission.init(
    {
      permissionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      timestamps: true,
    }
  );

  return Permission;
};
