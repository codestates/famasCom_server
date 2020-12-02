"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

exports.handler = function (event, context, callback) {
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const params = {
    TableName: "users",
    Key: {
      user_name: { S: "godkor200" },
    },
  };
  ddb.getItem(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });
};
