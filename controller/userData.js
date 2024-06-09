import { get ,mongoose} from "mongoose";
import User from "../models/userSchema.js";
import Tweet from "../models/tweetSchema.js";
import cloudinary from "../config/cloudinaryconfig.js";



export const userData = {

  getMyProfile: async (req, res) => {
    const users = await User.find({ username: req.user.username })
      .populate("tweets")
      .exec();
     
      
    res.status(200).json(users);
  },
  getuserDetails: async (req, res) => {
   
    const users = await User.find({ username: req.user.username })
      .populate("followers")
      .populate("following")
      .populate("tweets")
      .populate("name")
      .populate("profilePicture")
      .populate("bio")
      .populate("username")
      .exec();
    res.status(200).json(users);
  },
  getAllfollowingPosts: async (req, res) => {
    // try {
    //   // Find the current user
    //   const currentUser = await User.findOne({ username: req.user.username }).populate('following');
  
    //   if (!currentUser) {
    //     return res.status(404).json({ error: "User not found" });
    //   }
    //  console.log(currentUser,"currentUser")
    //   // Get the _ids of users the current user is following
    //   const followingUserIds = currentUser.following.map(user => user._id);
  
    //   // Find tweets where the username (userId) is in the followingUserIds array
    //   console.log('Tweet Query:', { username: { $in: followingUserIds } });
    //   const posts = await Tweet.find({ username: { $in: followingUserIds } })
    //     // .populate('username', 'name') // Populate the username field with the user's name
    //     // .sort({ createdAt: -1 })
    //     .limit(100) // Sort by createdAt in descending order (newest first)
    //     .exec();
        
    //   console.log(posts)
    //   console.log("Number of Posts Retrieved:", posts.length);

    //   res.status(200).json(posts);
    // } catch (error) {
    //   console.error("Error fetching posts:", error);
    //   res.status(500).json({ error: "Internal server error" });
    // }
    try {
      const username = req.user.username;
      console.log(username, "ye user 2 wala");
    
      // Find the user and populate the following field
      const user = await User.findOne({ username: username }).populate({
        path: 'following',
        populate: {
          path: 'tweets', // Assuming 'tweets' is the field name in the User schema
        }
      });
    
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      // Format the following users and their tweets
      const formattedFriends = user.following.map(friend => ({
        username: friend.username,
        name: friend.name,
        tweets: friend.tweets,
      }));
      let arr=[];
    formattedFriends.map(friend => {
        arr.push(friend.tweets)  
    })
    arr=arr.flat();
    arr.sort((a, b) => b.createdAt - a.createdAt);
      console.log("arr",arr)
    let ans=[]
    // arr.map(tweet=>{
      
    // })
      // console.log(formattedFriends);
      res.status(200).json({arr});
    }
    // const user = await User.find({username:username}).populate('following');
    // console.log("user",user)
    // const followingIds = user.following.map((followedUser) => followedUser._id);
    // console.log("followingIds",followingIds)
    // const tweets = await Tweet.find({ _id: { $in: followingIds } }).sort({ createdAt: -1 });
    // console.log("tweets",tweets)

    // res.json(tweets);
    // } 
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  
  },
  postTweet: async (req, res) => {
    try {
      const { username } = req.user;
      const{content} = req.body;
      const userId = await User.findOne({ username: username });
      console.log(username,content)
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }

      const file = req.file;
      let mediaUrl = '';

      if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        mediaUrl = result.secure_url;
      }

      const tweet = new Tweet({
        username: username,
        name: userId.name,
        profilePicture: userId.profilePicture,
        content,
        media: mediaUrl||'not posted on cloud',
      });
      const savedTweet = await tweet.save();

      await User.updateOne(
        { _id: userId._id },
        { $push: { tweets: savedTweet._id } }
      );

      res.status(201).json(savedTweet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
},
deleteTweet: async (req, res) => {
    try {
      const { id } = req.user;
      console.log(id,"id");
      const tweet = await Tweet.findOne({ _id: id });
      console.log(tweet,"tweet");
      if (!tweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }
      await Tweet.deleteOne({ _id: id });
      res.status(204).json({ message: "Tweet deleted successfully" });

}
catch{
      console.error("Error deleting tweet:");
      res.status(500).json({ error: "Internal server error" });
    }

},
updateTweet: async (req, res) => {
  try {
    const { id, content} = req.user;
    console.log(id,"id");
    const tweet = await Tweet.findOne({ _id: id });
    console.log(tweet,"tweet");
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });

}
await Tweet.updateOne({ _id: id }, { content });
const updatedTweet=await Tweet.findOne({ _id: id });
res.status(200).json({ message: "Tweet updated successfully",updatedTweet:updatedTweet });

}
catch{
      console.error("Error updating tweet:");
      res.status(500).json({ error: "Internal server error" });
    }

  },

  // follow user

  followUser: async (req, res) => {
    try {
      const { first, second } = req.body;
      const firstUser = await User.findOne({ username: first });
      const secondUser = await User.findOne({ username: second });
    
      if (!firstUser) {
        return res.status(404).json({ error: "User not found" });
      }
    
      if (!secondUser) {
        return res.status(404).json({ error: "User2 not found" });
      }
    
      await User.updateOne(
        { _id: firstUser._id },
        { $push: { followers: secondUser._id } }
      );
    
      await User.updateOne(
        { _id: secondUser._id },
        { $push: { following: firstUser._id } }
      );
    
      res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "Internal server error" });
    }},

    unFollowUser: async (req, res) => {
      try {
        const { first, second } = req.user;
        const firstUser = await User.findOne({ username: first });
        const secondUser = await User.findOne({ username: second });
      
        if (!firstUser) {
          return res.status(404).json({ error: "User not found" });
        }
      
        if (!secondUser) {
          return res.status(404).json({ error: "User2 not found" });
        }
      
        await User.updateOne(
          { _id: firstUser._id },
          { $pull: { followers: secondUser._id } }
        );
      
        await User.updateOne(
          { _id: secondUser._id },
          { $pull: { following: firstUser._id } }
        );
      
        res.status(200).json({ message: "User unfollowed successfully" });
      } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    getFollowers: async (req, res) => {
      try {
        const { username } = req.user;
        const user = await User.findOne({ username: username });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const followers = await User.find({ _id: { $in: user.followers } })
         .populate("username", "name")
         .exec();
        res.status(200).json({ followers });


    }catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getFollowing: async (req, res) => {
    try {
      const { username } = req.user;
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const following = await User.find({ _id: { $in: user.following } })
       .populate("username", "name")
       .exec();
      res.status(200).json({ following });  }
    catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ error: "Internal server error" });
    }},
    // not tested yet
    updateProfile: async (req, res) => {
      try {
        const { username, name, bio, location, email, } = req.user;
        const user = await User.findOne({ username: username });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const file = req.file;
      let mediaUrl = '';

      if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        mediaUrl = result.secure_url;
      }
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              name,
              bio,
              location,
              email,
              username,
              profilePicture: mediaUrl,
            },
          }
          );
    }
    catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }},
    updateProfile:async (req,res)=>{
      try {
        console.log("yaha aya")
        const {username}=req.user
      const {name,bio,location}=req.body
      console.log(username,name,bio,location)
      await User.updateOne({ username: username }, { name,bio,location });
      res.status(200).json({ message: "User updated successfully",});

      } catch (error) {
        res.status(500).json({error})
      }
      
    }
};
