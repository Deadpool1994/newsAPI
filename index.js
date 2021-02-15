const _ = require('lodash');
const fetch = require('node-fetch');

var myArgs = process.argv.slice(2);
const TOPIC = _.get(myArgs,'0',"COVID");
const REGION = _.get(myArgs,'1',"CANADA");
const PERIOD = _.get(myArgs,'2',48);

var parseString = require('xml2js').parseString;

let url = `https://news.google.com/rss/search?q=%20%22${TOPIC}%22%20when%3A${PERIOD}h&cr=CA&tdm=nws&hl=en-CA&gl=${REGION}&ceid=CA:en`;


(async function(){

    var xml = await fetch(url).then(res => res.text())
    parseString(xml, function (err, result) {
        console.dir(_.get(result,'rss.channel.0.item',[]));
    });

})();