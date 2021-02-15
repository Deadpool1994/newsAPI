var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Params for table COVID
 */
var params = {
    TableName : "COVID",
    KeySchema: [       
      { AttributeName: "title", KeyType: "HASH" },
      { AttributeName: "published_date", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [       
        { AttributeName: "url", AttributeType: "S" },
        { AttributeName: "title", AttributeType: "S" },
        { AttributeName: "publisher_name", AttributeType: "S" },
        { AttributeName: "published_date", AttributeType: "N" },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: "MetaIndex",
      KeySchema: [
          {
              AttributeName: "url",
              KeyType: "HASH"
              },
          {
              AttributeName: "publisher_name",
              KeyType: "RANGE"
          }
        ],
        Projection: {
            ProjectionType: "ALL"
            },
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
            }
        }],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});


var saveBulkData = async (data) => {

    data.forEach(function(article) {
        var param = {
            TableName: "COVID",
            Item: {
                "url":  article.url,
                "title": article.title,
                "publisher_name": article.publisher_name,
                "published_date": article.published_date
            }
        };
    
        docClient.put(param, function(err) {
           if (err) {
               console.error("Unable to add article", article.title, ". Error JSON:", JSON.stringify(err, null, 2));
           } else {
               console.log("PutItem succeeded:", article.title);
           }
        });
    });
}


