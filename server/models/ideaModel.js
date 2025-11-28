// models/ideaModel.js
import { ObjectId } from "mongodb";

/**
 * createIdea(db, { description, authorId })
 * authorId is an ObjectId or a string convertible to ObjectId
 */
export const createIdea = async (db, { description, authorId }) => {
  const ideas = db.collection("ideas");
  const doc = {
    description,
    authorId: typeof authorId === "string" ? new ObjectId(authorId) : authorId,
    createdAt: new Date(),
  };

  const result = await ideas.insertOne(doc);
  // return populated object with author username
  const pipeline = [
    { $match: { _id: result.insertedId } },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $project: {
        id: "$_id",
        description: 1,
        createdAt: 1,
        author: "$author.username",
      },
    },
  ];

  const [idea] = await ideas.aggregate(pipeline).toArray();
  // convert _id to id field and remove ObjectId in response
  if (idea && idea.id) idea.id = idea.id.toString();
  return idea;
};

/**
 * getAllIdeas(db, userIdString) - returns array with likesCount and liked boolean
 */
export const getAllIdeas = async (db, userIdString) => {
  const userId = userIdString ? new ObjectId(userIdString) : null;
  const ideas = db.collection("ideas");

  // aggregation: join author, count likes, and check if liked by user
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "idea_likes",
        localField: "_id",
        foreignField: "ideaId",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        liked: userId
          ? { $in: [userId, "$likes.userId"] }
          : false,
      },
    },
    {
      $project: {
        id: "$_id",
        description: 1,
        createdAt: 1,
        author: "$author.username",
        likesCount: 1,
        liked: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const rows = await ideas.aggregate(pipeline).toArray();
  // convert ids to strings
  return rows.map((r) => ({ ...r, id: r.id.toString() }));
};

/**
 * toggleLike(db, ideaIdString, userIdString)
 * returns { liked: boolean, likes: number }
 */
export const toggleLike = async (db, ideaIdString, userIdString) => {
  const ideaId = new ObjectId(ideaIdString);
  const userId = new ObjectId(userIdString);
  const likesColl = db.collection("idea_likes");

  // try to insert like; if duplicate, remove instead
  try {
    await likesColl.insertOne({ ideaId, userId, createdAt: new Date() });
    // inserted -> liked true
    const likes = await likesColl.countDocuments({ ideaId });
    return { liked: true, likes };
  } catch (err) {
    // duplicate key -> already liked -> remove like
    if (err.code === 11000) {
      await likesColl.deleteOne({ ideaId, userId });
      const likes = await likesColl.countDocuments({ ideaId });
      return { liked: false, likes };
    }
    // could also check by finding first
    // if other error, rethrow
    throw err;
  }
};

export const getUsers = async (db) => {
  const users = await db.collection("users").find({}, { projection: { passwordHash: 0 } }).toArray();
  return users.map(u => ({ id: u._id.toString(), username: u.username, createdAt: u.createdAt }));
};

export const getLikes = async (db) => {
  const rows = await db.collection("idea_likes").find().toArray();
  return rows.map(r => ({ ideaId: r.ideaId.toString(), userId: r.userId.toString() }));
};
