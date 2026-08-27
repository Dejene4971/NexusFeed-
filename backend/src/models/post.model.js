import mongoose, { Schema } from "mongoose";
 const PostSchema = new Schema(
    {
        name:{
            type:String,
            required :true,
            unique: true,
            lowerCase : true,
            minLength: 2,
            trim : true
        },
        description:{
            type:String,
            required:true,
            trim:true

        },
        age:{
            type: Number,
            required:true,
            min:1,
            max:150

        },
        author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

    },

    
    {
        timestamps : true
    }
 );

 export const Post = mongoose.model("Post", PostSchema);