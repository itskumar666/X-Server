import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, maxlength: 280 },
  media: [{ type: String }], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', tweetSchema);
