const {User} = require('../models');
const {AuthenticationError} = require ('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
      me: async (parent,args,context) => {
          if(context.user) {
              const userData= await User.findOne({_id: context.user._id}).populate('savedBooks');
              return userData;
          }
      }
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
        },

        //using InputBook content to save a new book to the savedBooks array
        saveBook: async(parent, {content} , context) => {
            if(context.user) {

                //THIS WILL TROW AN ERROR
                return Book.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {content}}},
                    {new: true}
                )
            }

            throw new AuthenticationError('Error')

        },


        //Path for removing book by a specified ID
        removeBook: async (parent, {bookId}, context ) => {
          if(context.user)
            return Book.findOneAndUpdate
        }
    }
}

module.exports = resolvers;