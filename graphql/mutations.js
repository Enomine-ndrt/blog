const { GraphQLString,GraphQLID } = require("graphql");
const {User,Post,Comment} =  require("../models");
const {PostType,CommentType} = require("./types");
const {createJWTToken} = require("../util/auth");

const register = {
    type: GraphQLString,
    description: "Register a new user and return a token",
    args:{
        username: {type: GraphQLString},
        email:  {type: GraphQLString},
        password:  {type: GraphQLString},
        displayName:  {type: GraphQLString},
    },
   async resolve(_,args){
        const {username,email,password,displayName} = args;
        const user = new User({username,email,password,displayName});
        await user.save();
        const token =  createJWTToken({
            _id: user._id,
            email: user.email,
            displayName: user.displayName
        });

        return token;
    }
}

const login = {
    type: GraphQLString,
    description: 'Login a user and return a token',
    args:{
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    },
  async resolve(_,args){
        //console.log(args)
     const user = await User.findOne({email:args.email}).select('+password');
     //console.log(user);
    if(!user || args.password !== user.password)
    throw new Error(`Invalid credentials`);
    const token = createJWTToken({
        _id: user._id,
        email: user.email,
        displayName: user.displayName
    });
    return token;
    }
}

const createPost = {
    type:PostType,
    description: 'Create a new post',
    args:{
        title: {type: GraphQLString},
        body: {type: GraphQLString},
    },
    async resolve(_,args,{verifiedUser}){
        console.log(verifiedUser);
     const post = new Post({
            title: args.title,
            body: args.body,
            authorId: verifiedUser._id
        });

        return post.save();
    }
}

const updatePost = {
    type: PostType,
    description: 'Update a post',
    args:{
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
    },
   async resolve(_,{id,title,body},{verifiedUser}){

        if(!verifiedUser) throw new Error('Unauthorized');

     const updatePost =  await Post.findOneAndUpdate(
            {_id:id,authorId: verifiedUser._id},
            {
                title,
                body
            },
            {
                new: true,
                runValidators: true
            }
            );

        return updatePost;
    }

}

const deletePost = {
    type: GraphQLString,
    description: 'Delete a post',
    args:{
        postId: {type: GraphQLID},
    },
    async resolve(_,{postId},{verifiedUser}){
        if(!verifiedUser) throw new Error('Unauthorized');
       const postDelete = await Post.findOneAndDelete({
            _id: postId,
            authorId: verifiedUser._id
        });

        if(!postDelete) throw new Error('Post not found');
        return 'Post deleted';
    }
}

const addComment = {
    type: CommentType,
    description: 'Add a comment to a post',
    args:{
        comment: {type: GraphQLString},
        postId: {type: GraphQLID},
    },
  async resolve(_,{comment,postId},{verifiedUser}){
     const newComment =  new Comment({
            comment,
            postId,
            userId: verifiedUser._id,
        });
       return newComment.save();
    }
}

const updateComment = {
    type: CommentType,
    description: "Update a comment",
    args:{
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
    },
    async resolve(_,{id,comment},{verifiedUser}){
        if(!verifiedUser) throw new Error('Unauthorized');
    const commentUpdate = await Comment.findOneAndUpdate(
            {
              _id: id,
              userId: verifiedUser._id,
            },
            {
                comment
            }
        );

     if(!commentUpdate) throw new Error('Comment not found');

        return commentUpdate
    }
}

const deleteComment = {
    type: GraphQLString,
    description: 'Delete a comment',
    args:{
        id: {type: GraphQLString}
    },
    async resolve(_,{id},{verifiedUser}){
        if(!verifiedUser)throw new Error('Unauthorized');
      const commentDelete =  await Comment.findOneAndDelete({
            _id: id,
            userId: verifiedUser._id,
        });
        if(!commentDelete)throw new Error('Comment not found');
        return 'Comment deleted';
    }
}

module.exports = {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
}
