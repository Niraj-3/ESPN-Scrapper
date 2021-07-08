const cheerio = require('cheerio');
const request = require('request');
const path = require('path')
const getAllMatchesLink = require('./allMatches');
const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595';
const fs = require('fs')


const iplPath = path.join(__dirname,'ipl')
dirCreator(iplPath)

request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    const $ = cheerio.load(html);
    let anchorTag = $('a[data-hover="View All Results"]');
    let link = anchorTag.attr('href');
    let fullLink = 'https://www.espncricinfo.com' + link;
    getAllMatchesLink(fullLink);
}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath)
    }
}