const Comment = require("../models/comments")
const Post = require("../models/posts")
const commentsMailer = require('../mailers/comments_mailer');
const Like = require('../models/likes');
module.exports.create = async function (req,res) {
  try {
        
        let post = await Post.findById(req.body.post)
      
      if(post){
        let comment = await Comment.create({
            content:req.body.content,
            user:req.user._id,
            post:req.body.post
        });
        
            post.comments.push(comment);
            post.save()
            req.flash("success","comment published")
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment); 
            if (req.xhr){
                
    
              return res.status(200).json({
                  data: {
                      comment: comment
                  },
                  message: "Post created!"
              });
          }
            res.redirect('/');
        
    }
    
  } catch (error) {
    req.flash("error","error")
    return;
  }
} 

module.exports.destroy = async function (req,res) {
    try {
        let comment= await Comment.findById(req.params.id)
        if(comment.user==req.user.id){
            let postId = comment.post
            comment.remove();
    
          let post=  await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
           // CHANGE :: destroy the associated likes for this comment
           await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

           if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }

        
          req.flash("success","Commente Deleted !")   
                return res.redirect('/');
           
        }else{
          req.flash('error',"unauthorised")
            return res.redirect('/');
        };
        
    } catch (error) {
        console.log(error);
        return;
    }

}
