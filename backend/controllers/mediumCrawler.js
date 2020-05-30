const axios = require("axios").default;
const {JSDOM} = require("jsdom");
const fetch = require("node-fetch");

const index = async (req,res) => {
    const tag = req.params.tag;
    console.log("tag",tag)
    try {
        const url = "https://medium.com/tag/" + tag;
        const result = await fetch(url, {
            method : "GET",
        });
        let blog = [];
        let html = await result.text();
        let dom = new JSDOM(html);
        let postLength = dom.window.document.querySelectorAll('div.postArticle').length;
        for(let i=0;i<postLength;i++){
            let blogDetails = {};
            blogDetails.id = dom.window.document.querySelectorAll('div.postArticle')[i].getAttribute('data-post-id');
            blogDetails.link = dom.window.document.querySelectorAll('div.postArticle-content')[i].parentElement.getAttribute('href');
            blogDetails.title = dom.window.document.querySelectorAll('h3.graf--title')[i].innerHTML;
            if(dom.window.document.getElementsByClassName('postMetaInline-authorLockup')[i].querySelector('[data-action=show-user-card]') === null){
                blogDetails.author = dom.window.document.getElementsByClassName('postMetaInline-authorLockup')[i].querySelector('[data-action=show-collection-card]').innerHTML;
            }
            else{
                blogDetails.author = dom.window.document.getElementsByClassName('postMetaInline-authorLockup')[i].querySelector('[data-action=show-user-card]').innerHTML;
            }
            blogDetails.description = dom.window.document.getElementsByClassName('graf--trailing')[i].innerHTML;
            blogDetails.time = dom.window.document.querySelectorAll('time')[i].getAttribute('datetime');
            blogDetails.readingTime = dom.window.document.getElementsByClassName('readingTime')[i].getAttribute('title');
            blogDetails.imgURL = dom.window.document.getElementsByClassName('graf-image')[i];
            blogDetails.applause = dom.window.document.getElementsByClassName('js-actionMultirecommendCount')[i].querySelector('[data-action=show-recommends]').innerHTML;
            blog.push(blogDetails)   
            console.log(blogDetails)     
        }
        console.log(blog);
        res.send(blog);
    }
    catch(err) {
        console.log(err)
    }
}


module.exports = {
    index,
}