import { buildSchema } from "graphql";

const schema = buildSchema(`

  type User {
    _id: ID!
    username: String!
    passwordHash: String
    createdAt: String!  
    lastLoginAt: String
  }

  type Idea {
    _id: ID!
    description: String!
    authorId: ID!
    creator: User!
  }

  input UserInputData {
    username: String!
    password: String!
  }

  input createIdeaInput {
    description: String!
  }

  type ToggleLikeResponse {
    success: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData!): User!
    createIdea(ideaInput: createIdeaInput!): Idea!
    toggleLike(ideaId: ID!): ToggleLikeResponse!
  }
  type authData {
    userId: ID!
    token: String!
  }

  type getIdea{
    _id: ID!
    description: String!
    creator: User!
    likesCount: Int!
    likedByUser: Boolean!
  }

  type RootQuery {
   login(username: String!, password: String!): authData!
   getIdeas: [getIdea!]!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`);
export default schema;
