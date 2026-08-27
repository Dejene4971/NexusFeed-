import { Post } from "../models/post.model.js";

//Create post

const createPost = async (req, res) =>{
    try{
    const {name, description, age} = req.body;
    if(!name || !description || !age){
        return res.status(400).json({
            message:"All fields are required!"
        });
    } 
    const post = await Post.create({
        name, description, age
    })
    res.status(201).json({
        message:"post created succesfully!"
    });

    }catch(error)
    {
        res.status(500).json({
            message:"Internal server Error"
        })


    }
    

};

//get/read all posts.

const getAllPosts = async (req, res) => {
    try {
        const getPosts = await Post.find();    
        res.status(200).json({
            message: "Posts fetched successfully",
            data: getPosts
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updatePost = async (req, res) => {
    try {
        //basic validation

        //{ name:x, description:y, age:z} -> [name, description, age]
        //Object.keys(req.body) -> [name, description, age]
        //{}= truthy, []= falsy, [name, description, age] = truthy

        if(Object.keys(req.body).length === 0){
            return res.status(400).json({
                message: "At least one field is required for update"
            });
        }

       /*       const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new:true});
       
       req.params.id -> /updatePost/:id = is the post id that we want to update from the url.
       req.body -> { name:x, description:y, age:z} = is the data that we want to update in the post.
       {new:true} -> is an option that tells mongoose to return the updated document instead of the old one.          
 */
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            });
        }
        res.status(200).json({
            message: "post updated successfully",
            data: post
        })

    }catch (error){
        res.status(500).json({
            message: "Internal server error"
        });
    }
    
};
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            });
        }
        res.status(200).json({
            message: "post deleted successfully",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export {
    createPost,
    getAllPosts,
    updatePost,
    deletePost
};
