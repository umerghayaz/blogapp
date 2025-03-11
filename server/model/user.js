// import { DataTypes } from "sequelize";


// const User = (sequelize, Sequelize) => {
//     const User = sequelize.define("users", {
//       firstname: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       lastname: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     });
//     return User;
// }

// export default User;
import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize) => {
  class User extends Model {
    async comparePassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER, // Adjust if using UUIDs
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,

      hooks: {
        // Hash password before saving the user
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};

