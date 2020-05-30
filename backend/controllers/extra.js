const index = async (socket,tag) => {
    
    console.log("tag",tag);
    try {
        const url = "https://medium.com/tag/" + tag;
        const result = await fetch(url, {
            method : "GET",
        });
        let html = await result.text();
        const $ = cheerio.load(html);

        let blogs = [];

        let relatedTags = [];
        
        $('.tags--postTags').each((i,elem) => {
            let tag = $(elem).find('[data-action-source=related]').text();
            relatedTags.push(tag);
        });

        $('.postArticle').each((i,elem) => {
            let blogDetails = {};

            blogDetails.id = $(elem).attr('data-post-id');
            blogDetails.author = $(elem).find('.postMetaInline').find('[data-action=show-user-card]').text();
            blogDetails.time = $(elem).find('time').attr('datetime');
            blogDetails.readingTime = $(elem).find('.readingTime').attr('title');
            blogDetails.imgURL = $(elem).find('.graf-image').attr('src');
            blogDetails.title = $(elem).find('.graf--title').text();
            blogDetails.description = $(elem).find('.graf--trailing').text();
            blogDetails.applause = $(elem).find('.js-actionMultirecommendCount').find('[data-action=show-recommends]').text();
            blogDetails.link = $(elem).find('.postArticle-content').parent().attr('href');
            
            blogs.push(blogDetails);
        });

        for(let i=0;i<blogs.length;i++){
            socket.emit('crawling' , blogs[i]);
        
            let sTime = Date.now();
        
            const blog = await crawlPost(blogs[i]);
        
            let eTime = Date.now();
            timeTaken = eTime-sTime
            
            socket.emit('crawled',{blog,timeTaken});
        }
    }
    catch(err){
        console.log(err)
    }
}