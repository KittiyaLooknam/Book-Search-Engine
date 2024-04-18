const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth'); // import signToken() function from utils/auth.js
const { User, Book } = require('./models'); // import User and Book models

// Define resolvers funcation
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books') // populate the books field of the user
                    .populate('friends'); // populate the friends field of the user

                return userData; // Return user data
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        // Resolver function for the 'login' mutation
        login: async (parent, { email, password }) => {
            // Find the user by email
            const user = await User.findOne({ email });
            // If user is not found, throw an authentication error
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // If user is found, compare password to the hashed password in the database
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, throw an authentication error
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // If the password is correct, sign a token
            const token = signToken(user);

            // Return an object that combines the user data and the token
            return { token, user };
        },
        // Resolver function for the 'addUser' mutation
        addUser: async (parent, args) => {
            // Create new user
            const user = await User.create(args);
            // Generet JWT token 
            const token = signToken(user);
            // Return an object that combines the user data and the token
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            // check if user is anthenicted 
            if (context.user) {
                const updatedUser = await User.findOneIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { saveBook: bookData } }, // add the book to the saveBook array
                    { new: true } // return the updated user data
                ).populate('saveBook');
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            // check if user is authenticated
            if (context.user) {
                const updatedUser = await User.findOneIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }, // add the book to the saveBook array
                    { new: true } // return the updated user data
                ).populate('saveBook'); // populate the saveBook array with the book data
                return updatedUser; // return the updated user data
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

// Export the resolvers
module.exports = resolvers;