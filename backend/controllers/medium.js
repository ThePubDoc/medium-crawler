const fetch = require("node-fetch");
const cheerio = require("cheerio");

const Post = require('../models/blog');
const History = require('../models/history');

//post crawler
const crawlPost = async (blog) => {
    try {    
        const findBlog = await Post.findOne({id : blog.id});
        if(findBlog){
            return findBlog;
        }
        else {
            let content = await getContent(blog);
            let responses = await getAllResponses(blog);

            blog.content = content;
            blog.responses = responses;

            const saveBlog = await Post.findOneAndUpdate({id : blog.id} , blog , {upsert : true});
            return blog;
        }
    }
    catch(err) {
        console.log(err)
    }
}

//html content of blog 
const getContent = async (blog) => {
    const blogReq = await fetch(blog.link , {
        method : "GET",
    });
    try{
        let $ = cheerio.load(await blogReq.text());
        const post = $('article').html();
        return post;
    }
    catch(err){
        console.log(err);
        return "unable to fetch content";
    }
}

//all responses of blog
const getAllResponses = async (blog) => {
    
    const responsesURL = "https://medium.com/_/api/posts/"+blog.id+"/responsesStream";
    const responsesRequest = await fetch(responsesURL , {
        method : "GET",
    });
    let res = await responsesRequest.text();
    res = res.substr(16);
    res = JSON.parse(res);
    let posts = res.payload.references.Post;
    let users = res.payload.references.User;

    let responses = [];

    for(p in posts){
        let response = {};
        let text = "";
        let paragraphs = posts[p].previewContent.bodyModel.paragraphs;
        for(let i=0;i<paragraphs.length;i++){
            text = text + paragraphs[i].text;
        }
        let user = users[posts[p].creatorId].name;
        response.name = user;
        response.text = text;
        responses.push(response);
    }
    return responses;
}


// const stream = async (socket,tag,count) => {

//     const saveTag = await History.findOneAndUpdate({tag : tag}, {tag}, {upsert: true});

//     const url = "https://medium.com/_/api/tags/"+tag+"/stream";
//     let body = {"limit":10,"ignoredIds":[],"sortBy":"recent-vote-count"};
//     const res = await fetch(url , {
//         method : "POST",
//         headers : {"x-xsrf-token": "JI2gNBIPrBpA",
//                     "accept": "application/json",
//                     "content-type": "application/json"},
//         body : JSON.stringify(body)
//     })
//     let response = await res.text();
//     response = response.substr(16);

//     response = JSON.parse(response);

//     // if(response.payload.paging.next){
//     //     ignoredIds = response.payload.paging.next.ignoredIds;
//     // }
//     // else{
//     //     ignoredIds = [];
//     // }
//     // console.log(ignoredIds)
//     const relatedTags = [];

//     for(let i=0;i<response.payload.relatedTags.length;i++){
//         relatedTags.push(response.payload.relatedTags[i].name);
//     }

//     const post = response.payload.references.Post;
//     const users = response.payload.references.User;
//     let blogs = [];
//     for(p in post){
//         let blog = {};
//         blog.id = post[p].id;
        
//         blog.author = users[post[p].creatorId].name;
//         blog.authorImgURL = "https://cdn-images-1.medium.com/" + users[post[p].creatorId].imageId;
//         blog.title = post[p].title;
//         blog.time = post[p].createdAt;
//         blog.description = post[p].content.subtitle;
//         blog.readingTime = parseInt(post[p].virtuals.readingTime);
//         blog.imgURL = "https://cdn-images-1.medium.com/" + post[p].virtuals.previewImage.imageId;
//         blog.link = "https://medium.com/p/"+post[p].id;
//         tags = [];
//         for(i=0;i<post[p].virtuals.tags.length;i++){
//             tags.push(post[p].virtuals.tags[i].slug)    
//         }
//         blog.tags = tags;
//         blogs.push(blog)
//     }

//     socket.emit('related-tags',relatedTags);
    
//     let start = 0;
//     if(count===8){
//         start = 0;
//     }
//     else {
//         start = 8;
//     }

//     socket.emit('pending', blogs.slice(start,start+count));
    
//     for(i=start;i<start+count;i++){
//         socket.emit('crawling',blogs[i]);
        
//         const startTime = Date.now();
//         const post = await crawlPost(blogs[i]);
//         const endTime = Date.now();
        
//         socket.emit('crawled',blogs[i]);
//         socket.emit('timeTaken',{
//             time: endTime-startTime,
//             blog : blogs[i],
//         });
//     }
//     if(start === 0 && blogs.length === 10){
//         socket.emit('next' , 2)
//     }
// }

const stream = async (socket,tag,ignoredIds) => {

    console.log("tag:"+tag);
    const saveTag = await History.findOneAndUpdate({tag : tag}, {tag}, {upsert: true});

    const url = "https://medium.com/_/api/tags/"+tag+"/stream";
    let body = {"limit":10,"ignoredIds":ignoredIds,"sortBy":"recent-vote-count"};
    const res = await fetch(url , {
        method : "POST",
        headers : {"x-xsrf-token": "JI2gNBIPrBpA",
                    "accept": "application/json",
                    "content-type": "application/json"},
        body : JSON.stringify(body)
    })
    let response = await res.text();
    response = response.substr(16);

    response = JSON.parse(response);

    if(response.payload.paging.next){
        ignoredIds = response.payload.paging.next.ignoredIds;
    }
    else{
        ignoredIds = [];
    }
    console.log(ignoredIds)

    const relatedTags = [];

    for(let i=0;i<response.payload.relatedTags.length;i++){
        relatedTags.push(response.payload.relatedTags[i].name);
    }

    const post = response.payload.references.Post;
    const users = response.payload.references.User;
    let blogs = [];
    for(p in post){
        let blog = {};
        blog.id = post[p].id;
        
        blog.author = users[post[p].creatorId].name;
        blog.authorImgURL = "https://cdn-images-1.medium.com/" + users[post[p].creatorId].imageId;
        blog.title = post[p].title;
        blog.time = post[p].createdAt;
        blog.description = post[p].content.subtitle;
        blog.readingTime = parseInt(post[p].virtuals.readingTime);
        blog.imgURL = "https://cdn-images-1.medium.com/" + post[p].virtuals.previewImage.imageId;
        blog.link = "https://medium.com/p/"+post[p].id;
        tags = [];
        for(i=0;i<post[p].virtuals.tags.length;i++){
            tags.push(post[p].virtuals.tags[i].slug)    
        }
        blog.tags = tags;
        blogs.push(blog)
    }

    socket.emit('related-tags',relatedTags);

    socket.emit('pending', blogs);
    
    for(i=0;i<blogs.length;i++){
        socket.emit('crawling',blogs[i]);
        
        const startTime = Date.now();
        const post = await crawlPost(blogs[i]);
        const endTime = Date.now();
        
        socket.emit('crawled',blogs[i]);
        socket.emit('timeTaken',{
            time: endTime-startTime,
            blog : blogs[i],
        });
    }

    socket.emit('next' , ignoredIds)
}


module.exports = {
    stream
}