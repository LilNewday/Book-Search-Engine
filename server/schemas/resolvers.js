const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Resolver for Query type to return the user object if authenticated
    me: async (parent, args, context) => {
    // Check if the user is authenticated
      if (context.user) {
        // Get the user data except for __v and password fields
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        // Return the user data
        return userData;
      }

      // Throw an authentication error if the user is not authenticated
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // Resolver for Mutation type to add a new user
    addUser: async (parent, args) => {
    // Create a new user based on the arguments
      const user = await User.create(args);
      // Generate a token for the new user
      const token = signToken(user);

      // Return an object containing the token and the user
      return { token, user };
    },
    // Resolver for Mutation type to login a user
    login: async (parent, { email, password }) => {
    // Find the user by email
      const user = await User.findOne({ email });

      // Throw an authentication error if the user is not found
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Check if the provided password matches the user's password
      const correctPw = await user.isCorrectPassword(password);

      // Throw an authentication error if the password is incorrect
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Generate a token for the authenticated user
      const token = signToken(user);
      // Return an object containing the token and the user
      return { token, user };
    },
    // Resolver for Mutation type to save a book to a user's list
    saveBook: async (parent, { bookData }, context) => {
        
    // Check if the user is authenticated
      if (context.user) {
        
        // Update the user's savedBooks array by pushing a new book object
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updatedUser;
      }

      // Throw an authentication error if the user is not authenticated
      throw new AuthenticationError('You need to be logged in!');
    },
    // Resolver for Mutation type to remove a book from a user's list
    removeBook: async (parent, { bookId }, context) => {
        
    // Check if the user is authenticated
      if (context.user) {
        
        // Update the user's savedBooks array by removing a book object based on bookId
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      // Throw an authentication error if the user is not authenticated
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
