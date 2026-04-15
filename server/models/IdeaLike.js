const { DataTypes } = require("sequelize");
const sequelize = require("../db/seqelize");

const IdeaLike = sequelize.define(
  "IdeaLike",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    idea_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "idea_likes",
    timestamps: false,
  },
);

module.exports = IdeaLike;