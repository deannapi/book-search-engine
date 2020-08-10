const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
            return userData;
            }
            throw new AuthenticationError('You are not logged in.');
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args, context) => {
            if (context.user) {
                const newUser = await User.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $push: { users: user._id }},
                    { new: true }
                );
                return user;
            }
        },

        saveBook: {

        },

        deleteBook: {

        }
    }
}

module.exports = resolvers;