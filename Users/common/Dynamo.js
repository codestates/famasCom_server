const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});
const Dynamo = {
  async write(userData, TableName) {
    let putParams = {
      TableName: "Users",
      Item: {
        userId: Math.floor(Math.random() * 100000),
        user_name: userData.user_name,
        password: userData.password,
        createdAt: `${new Date().getFullYear()}년 ${new Date().getMonth()}월 ${new Date().getDate()}일 ${new Date().getHours()}시 ${new Date().getMinutes()}분 ${new Date().getSeconds()}초`,
      },
    };
    console.log(
      "🚀 ~ file: Dynamo.js ~ line 19 ~ write ~ putParams",
      putParams
    );
    let data = await documentClient.put(putParams).promise();
    console.log("🚀 ~ file: Dynamo.js ~ line 24 ~ write ~ data", data);
    if (!data) {
      throw Error(`There was an error put in the data from ${TableName}`);
    }
    return data;
  },
};
module.exports = Dynamo;
