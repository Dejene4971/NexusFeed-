import { Post } from "../models/post.model.js";

//Create post

const createPost = async (req, res, next) =>{
    try{
    const {name, description, age} = req.body;
    if(!name || !description || !age){
        return res.status(400).json({
            message:"All fields are required!"
        });
    } 
    const post = await Post.create({
        name, description, age, author: req.user._id,
    })
    res.status(201).json({
        success: true,
        message:"post created succesfully!",
        data: post
    });

    } catch (error) {
        next(error);
    }
    

};

//get/read all posts.

const getAllPosts = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const search = req.query.search ? req.query.search.trim() : "";
        const sortBy = req.query.sort || "newest";

        let query = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        let sortOrder = {};
        if (sortBy === "oldest") {
          sortOrder = { createdAt: 1 };
        } else {
          sortOrder = { createdAt: -1 };
        }

        const total = await Post.countDocuments(query);
        const getPosts = await Post.find(query)
          .sort(sortOrder)
          .skip(skip)
          .limit(limit)
          .populate("author", "username email");

        res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            pagination: {
              total,
              page,
              limit,
              pages: Math.ceil(total / limit),
            },
            data: getPosts
        });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username email");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
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
            success: true,
            message: "post updated successfully",
            data: post
        })

    } catch (error) {
        next(error);
    }
    
};
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "post deleted successfully",
            data: post
        })
    } catch (error) {
        next(error);
    }
};

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
