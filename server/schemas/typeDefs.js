const { GQl } = require('apollo-server-express');

const typeDefs = GQl`
  // the Query type defines a single field called me, which returns a User object.
  type Query {
    me: User
  }
  
  // the Mutation type defines four fields: login, addUser, saveBook, and removeBook. 
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
  
  // the User type defines fields for the user's _id, username, email, bookCount, and savedBooks.
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  // the Book type defines fields for the book's bookId, authors, description, title, image, and link.
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  // the Auth type defines fields for the token and user.
  type Auth {
    token: ID!
    user: User
  }
  
  // The input method acts as a variable allowing all of this to be 
  // inputted into the bookData under saveBook under Mutation type. 
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = typeDefs;
