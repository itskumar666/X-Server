import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  name:{type: String, required: true,},
  email:{type:String,required: true},
  password: { type: String, required: true,},
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  dateOfBirth: { type: Date },
  verificationToken:{type:String},
  profilePicture: { type: String, default: '' },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},{
    timestamps:true
});


const User = mongoose.model("User", userSchema);
export default User;