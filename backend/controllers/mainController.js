const Post = require('../models/blog');
const History = require('../models/history');

const fetch = require('node-fetch')

const index = (req,res) => {
    res.render("index");
}

const showBlog = async (req,res) => {
    const id = req.params.id;
    const post = await Post.find({id : id});
    // console.log(post)
    res.render("showBlog", {
        post
    });
}

const history = async (req,res) => {
    const tags = await History.find();
    const searchedTags = [];
    for(let i=0;i<tags.length;i++){
        searchedTags.push(tags[i])
    }
    res.send(searchedTags)
}

module.exports = {
    index,
    showBlog,
    history
}