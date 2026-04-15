const { DataTypes } = require("sequelize");
const sequelize = require("./../db/seqelize");

const Idea = sequelize.define(
  "Idea",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ideas",
    timestamps: false,
  }
);

module.exports = Idea;
