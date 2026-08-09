import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    sex : {
        type : String,
        enum : ["male", "female", "other"],
        default : "other"
    },
    DOB : {
      type : String,
      defaulf : ""
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(){
    try{
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

    }catch(error){
      throw new Error(error);
    }
});

userSchema.methods.comparePassword = async function(password){
  try{
    return await bcrypt.compare(password, this.password);
  }catch(err){
    throw new Error(err);
  }
}


export default mongoose.model("User", userSchema);