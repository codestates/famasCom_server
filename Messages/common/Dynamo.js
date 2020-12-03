const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

const Dynamo = {
  //Messages 삭제
  async _delete(msgId) {
    let deleteParams = {
      Key: {
        msgId: msgId,
      },
      TableName: "Messages",
    };
    return await documentClient.delete(deleteParams).promise();
  },
  //Messages 수정
  async _update(msgData, msgId) {
    const { userName, msg } = msgData;
    let updateParams = {
      Key: {
        msgId: msgId,
      },
      TableName: "Messages",
      ConditionExpression: "attribute_exists(msgId)",
      UpdateExpression:
        "SET userName = :userName, msg = :msg, updateAt = :updateAt",
      ExpressionAttributeValues: {
        ":userName": userName,
        ":msg": msg,
        ":updateAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    };
    let data = await documentClient.update(updateParams).promise();
    return data;
  },
  //Messages 필터
  async _get(msgId) {
    let params = {
      TableName: "Messages",
      Key: { msgId: msgId },
    };
    let data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for msgId of ${msgId} from ${TableName}`
      );
    }
    return data.Item;
  },
  //Messages 올 렌더(render)
  async _scan() {
    let scanParams = {
      TableName: "Messages",
    };
    let data = await documentClient.scan(scanParams).promise();
    if (!data) {
      throw Error(`There was an error fetching the data from ${TableName}`);
    }
    return data;
  },
  //Messages 쓰기
  async _write(dataMsg, TableName) {
    let putParams = {
      TableName: "Messages",
      Item: {
        msgId: uuidv4(),
        userName: dataMsg.usedName,
        msg: dataMsg.msg,
        like: 0,
        comments: [],
        createdAt: new Date().toISOString(),
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
