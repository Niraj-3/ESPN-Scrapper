const cheerio = require('cheerio');
const request = require('request');
const path = require('path')
const fs = require('fs')
const xlsx = require('xlsx')
function matchDetail(fullLink){
    request(fullLink,cb);
}

function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        getDetails(html);
    }
}

function getDetails(html){
    const $ = cheerio.load(html);
    let description = $('.event .description');
    let  arr = description.text().split(',');
    let venue = arr[1].trim();
    let date = arr[2].trim();
    let result = $('.event .status-text');
    result = result.text().trim();
    let scoreTable = $('.card.content-block.match-scorecard-table>.Collapsible');
    for(let i=0;i<scoreTable.length;i++){
        let teamName = $(scoreTable[i]).find('h5').text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponenetIndex = i == 0?1:0;
        let opponentTeamName = $(scoreTable[opponenetIndex]).text();
        opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
        console.log(`${venue} | ${date} | ${result} | ${teamName} | ${opponentTeamName}`);
        let cInnings = $(scoreTable[i]);
        let allRows = cInnings.find('.table.batsman tbody tr');
        for(let j=0;j<allRows.length;j++){
            let allCols = $(allRows[j]).find('td');
            let isBatsman = $(allCols[0]).hasClass("batsman-cell");
            if(isBatsman == true){
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let strikeRate = $(allCols[7]).text();
                console.log(`${playerName}  ${runs}   ${balls}  ${fours}   ${sixes}   ${strikeRate}`);
                processPlayer(teamName,playerName,runs,balls,fours,sixes,strikeRate,opponentTeamName,venue,date,result)
            }
        }
    }
    console.log('**********************************************************************************');
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,strikeRate,opponentTeamName,venue,date,result){
    let teamPath = path.join(__dirname,'ipl',teamName)
    dirCreator(teamPath)
    let filePath = path.join(teamPath,playerName +'.xlsx')
    let content = excelReader(filePath,playerName)
    let playerObj = {
        teamName,
        playerName,
        runs,balls,
        fours,
        sixes,
        strikeRate,
        opponentTeamName,
        venue,date,
        result
    }
    content.push(playerObj)
    excelWriter(filePath,content,playerName)
}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath)
    }
}

function excelWriter(filepath,json,sheetName){

    let newWB = xlsx.utils.book_new();//new workbook is created
    let newWS = xlsx.utils.json_to_sheet(json);//json data to excel format
    //newWb,ws,sheet name
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    //filepath
    xlsx.writeFile(newWB, filepath);//if file not present it will be made else content will replace
}

//read
function excelReader(filepath,sheetName){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);//workbook get
    let excelData = wb.Sheets[sheetName];//sheet
    let ans = xlsx.utils.sheet_to_json(excelData);//sheet data get
    return ans
}

module.exports = matchDetail;