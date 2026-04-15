const { Idea, User, IdeaLike } = require("../models");
const { col } = require("sequelize");

async function postIdea(req, res) {
  const { description } = req.body;

  const authorId = req.userId;

  await Idea.create({ author_id: authorId, description });

  res.json({ message: "Idea Created" });
}

async function getIdeas(req, res) {
  try {
    const ideas = await Idea.findAll({
      attributes: [
        "id",
        "description",
        "author_id",
        [col("author.username"), "username"], // 👈 flatten
      ],
      include: [
        {
          model: User,
          as: "author",
          attributes: [], // 👈 prevent nesting
        },
      ],
      raw: true,
    });

    res.status(200).json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function toggleLike(req, res) {
  const { id } = req.body;
  const userId = req.userId;

  console.log({ id, userId });

  await IdeaLike.create({ idea_id: id, user_id: userId });

  res.json({ message: "liked" });
}

function getLikes(req, res) {
  const query = `
      SELECT * FROM idea_likes
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching likes" });
    res.status(200).json(rows);
  });
}

module.exports = { postIdea, getIdeas, toggleLike, getLikes };
