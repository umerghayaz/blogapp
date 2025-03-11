import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Role extends Model {}

  Role.init(
    {
      roleName: {
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
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
