const {Book,User} = require('../models');
const {AuthenticationError} = require ('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {

    },
    Mutation: {
        //LOOK AT user-controller.js as reference. 

        //Adds an individual user and signs a token to that new user
        addUser: async(parent, args) => {
            const user = await User.create(...args);
            const token = signToken(user);
            return {token,user};
        },
        login: async (parent, args) => {

            const user = await User.findOne({ $or: [{username: args.username}, {email: args.email}] }); // IDK IF THIS WILL WORK
            if (!user){
                throw new AuthenticationError('There are No Users found with that Username or Email');
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong Password!');
            }

            const token = signToken(user);
            return {token,user};

        }
    }
}

module.exports = resolvers;