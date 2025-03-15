import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Post extends Model {}

  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Post title is required" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Post content is required" },
        },
      },
      categories: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      approverId: {
        type: DataTypes.INTEGER, // or DataTypes.UUID if using UUIDs
        allowNull: true, // Can be null if not yet approved
        references: {
          model: "users", // Reference the 'users' table
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      featuredImage: {
        type: DataTypes.STRING,
      },
      authorId: {
        type: DataTypes.INTEGER, // or DataTypes.UUID
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
      deletedAt: "destroyTime",
    }
  );

  return Post;
};
