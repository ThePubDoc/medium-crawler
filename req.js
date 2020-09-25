// const fetch = require('node-fetch');
// const cheerio = require("cheerio");
// const {JSDOM} = require("jsdom");

// const res = async ()=> {
//     const url = "https://medium.com/_/api/tags/food/stream";
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
//     // console.log(response.payload.paging)
    
//     // ignoredIds = response.payload.paging.previous;
    
//     const post = response.payload.references.Post;
//     const users = response.payload.references.User;
//     const collecctions = response.payload.references.Collection;
    
//     let blogs = [];
    
//     for(p in post){
    
//         let blog = {};
//         blog.id = post[p].id;
//         blog.uniqueSlug = post[p].uniqueSlug;
//         blog.creatorId = post[p].creatorId;
//         blog.author = users[post[p].creatorId].name;
//         blog.title = post[p].title;
//         blog.time = post[p].createdAt;
//         blog.subtitle = post[p].content.subtitle;
//         blog.imageId = post[p].virtuals.previewImage.imageId;
//         blog.readingTime = post[p].virtuals.readingTime;
//         tags = [];
//         for(i=0;i<post[p].virtuals.tags.length;i++){
//             tags.push(post[p].virtuals.tags[i].slug)    
//         }
//         blog.tags = tags;
//         // console.log("--",post[p].previewContent.bodyModel.sections)
//     }
// }

// res()
