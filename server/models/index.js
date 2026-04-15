const sequelize = require("../db/seqelize");
const User = require("./User");
const Idea = require("./Idea");
const IdeaLike = require("./IdeaLIke");

// Associations
User.hasMany(Idea, {
  foreignKey: "author_id",
});

Idea.belongsTo(User, {
  foreignKey: "author_id",
  as: "author",
});

// User ↔ Idea (likes)
User.belongsToMany(Idea, {
  through: IdeaLike,
  foreignKey: "user_id",
  otherKey: "idea_id",
});

Idea.belongsToMany(User, {
  through: IdeaLike,
  foreignKey: "idea_id",
  otherKey: "user_id",
});

(async () => {
  await sequelize.sync({ force: false });
  console.log("Database synced");
  console.log(await Idea.describe()); // debug schema
})();

module.exports = {
  sequelize,
  User,
  Idea,
  IdeaLike,
};
