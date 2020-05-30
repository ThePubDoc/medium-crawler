const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    id: String,
    author: String,
    time: String,
    readingTime : String,
    imgURL: String,
    title: String,
    description: String,
    link: String,
    tags: Array,
    content: String,
    responses: Array,
});

module.exports = Posts = mongoose.model("posts", postSchema);