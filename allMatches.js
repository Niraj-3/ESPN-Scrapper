const cheerio = require('cheerio');
const request = require('request');
const matchDetail = require('./matchDetail');

function getAllMatchesLink(fullLink){
    request(fullLink,cb);
}

function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        extractAllLink(html);
    }
}

function extractAllLink(html){
    const $ = cheerio.load(html);
    let scorecardEle = $('a[data-hover="Scorecard"]');
    for(let i=0;i<scorecardEle.length;i++){
        let link = $(scorecardEle[i]).attr('href');
        let fullLink = 'https://www.espncricinfo.com' + link;
        console.log(fullLink)
        console.log('*********************************************************************************')
        matchDetail(fullLink);
        
    }
}
module.exports = getAllMatchesLink;