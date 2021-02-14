const _ = require('lodash');

var myArgs = process.argv.slice(2);
const TOPIC = _.get(myArgs,'0',"COVID");
const REGION = _.get(myArgs,'1',"CANADA");
const PERIOD = _.get(myArgs,'2',48);

