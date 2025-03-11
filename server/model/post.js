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
        type: DataTypes.INTEGER, // or DataTypes.UUID if you use UUIDs
        allowNull: false,
        // If you want to enforce foreign key constraints, you can add:
        references: {
          model: "users", // name of Target model/table
          key: "id",      // key in Target model that we're referencing
        },
      },
      
      // For comments, you could either add a JSON field (if comments remain embedded)
      // or create a separate Comment model. For one-to-many in a relational DB,
      // it is recommended to create a separate model.
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
      deletedAt: 'destroyTime',
    }
  );

  return Post;
};
