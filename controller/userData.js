import { get ,mongoose} from "mongoose";
import User from "../models/userSchema.js";
import Tweet from "../models/tweetSchema.js";



export const userData = {

  getownDetails: async (req, res) => {
    const users = await User.find({ username: req.user.username })
      .populate("followers")
      .populate("following")
      .populate("tweets")
      .populate("name")
      .populate("profilePicture")
      .populate("username")
      .populate("email")
      .populate("bio")
      .populate("dateofbirth");
    res.status(200).json(users);
  },
  getuserDetails: async (req, res) => {
    const users = await User.find({ username: req.user.username })
      .populate("followers")
      .populate("following")
      .populate("tweets")
      .populate("name")
      .populate("profilePicture")
      .populate("username")
      .populate("bio")
    res.status(200).json(users);
  },
  getAllfollowingPosts: async (req, res) => {
    try {
      // Find the current user
      const currentUser = await User.findOne({ username: req.user.username });
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find tweets from users that the current user is following
      const posts = await Tweet.find({ userId: { $in: currentUser.following } })
        .populate("name")
        .populate("media")
        .populate("username")
        .populate("content");

      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  postTweet: async (req, res) => {
    try {
      const { username, content, media } = req.body;
     
      const userId=User.findOne({ username:username }).populate("_id");
     console.log(userId,"req.userid hai bc sbajdhhbjhsdbjasd");
    console.log(username,"req.body hai bc sbajdhhbjhsdbjasd");
      const tweet = new Tweet({
        username: mongoose.Types.ObjectId(userId),
        content,
        media
      });
  
      await tweet.save();
      res.status(201).json(tweet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
},
deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findOne({ _id: req.params.id });
      if (!tweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }

}
catch{
      console.error("Error deleting tweet:", error);
      res.status(500).json({ error: "Internal server error" });
    }

}};
