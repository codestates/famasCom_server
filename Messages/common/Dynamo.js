const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

const Dynamo = {
  async get(msgId) {
    console.log("🚀 ~ file: Dynamo.js ~ line 11 ~ get ~ msgId", msgId);
    let params = {
      TableName: "Messages",
      Key: { msgId },
    };
    let data = await documentClient.get(params).promise();
    console.log("🚀 ~ file: Dynamo.js ~ line 17 ~ get ~ data", data);

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for msgId of ${msgId} from ${TableName}`
      );
    }
    console.log(data);
    return data.Item;
  },

  async scan() {
    let scanParams = {
      TableName: "Messages",
    };
    let data = await documentClient.scan(scanParams).promise();
    if (!data) {
      throw Error(`There was an error fetching the data from ${TableName}`);
    }
    return data;
  },
  async write(dataMsg, TableName) {
    let putParams = {
      TableName: "Messages",
      Item: {
        msgId: Math.floor(Math.random() * 100000),
        userName: dataMsg.usedName,
        msg: dataMsg.msg,
        like: 0,
        comments: [],
        createdAt: `${new Date().getFullYear()}년 ${new Date().getMonth()}월 ${new Date().getDate()}일 ${new Date().getHours()}시 ${new Date().getMinutes()}분 ${new Date().getSeconds()}초`,
      },
    };
    let data = await documentClient.put(putParams).promise();
    if (!data) {
      throw Error(`There was an error put in the data from ${TableName}`);
    }
    return data;
  },
};
module.exports = Dynamo;
