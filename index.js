const _ = require('lodash');
const fetch = require('node-fetch');
const moment = require('moment');
var db_lib = require('./db.js');
console.log("DB: ",db_lib);

// Fetch aeguments for topic, region, period
var myArgs = process.argv.slice(2);
const TOPIC = _.get(myArgs,'0',"COVID");              //TOPIC
const REGION = _.get(myArgs,'1',"CANADA");            //COUNTRY
const PERIOD = _.get(myArgs,'2',48);                  //PERIOD in hour

var parseString = require('xml2js').parseString;

let url = `https://news.google.com/rss/search?q=%20%22${TOPIC}%22%20when%3A${PERIOD}h&cr=CA&tdm=nws&hl=en-CA&gl=${REGION}&ceid=CA:en`;


(async function(){

    var xml = await fetch(url).then(res => res.text())
    parseString(xml, async function (err, result) {
        let articles = _.get(result,'rss.channel.0.item',[]); 
        articles = articles.map((article) => {
          return {
            title: _.get(article,'title.0',null),
            url: _.get(article,'link.0',null),
            published_date: _.get(article,'pubDate.0') ? moment(_.get(article,'pubDate.0')).unix() : moment().unix(),
            publisher_name: _.get(article,'source.0._',null)
          }
        });
        //console.log(articles);
        await db_lib.saveBulkData(articles);
    });

})();