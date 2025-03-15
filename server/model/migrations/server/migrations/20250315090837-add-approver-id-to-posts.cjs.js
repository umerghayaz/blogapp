'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the approverId column to the posts table
    await queryInterface.addColumn("posts", "approverId", {
      type: Sequelize.INTEGER, // Use Sequelize.UUID if using UUIDs
      allowNull: true, // Allows existing posts to remain unchanged
      references: {
        model: "users", // Referencing the 'users' table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // If the approver is deleted, set approverId to NULL
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the approverId column if the migration is rolled back
    await queryInterface.removeColumn("posts", "approverId");
  }
};
