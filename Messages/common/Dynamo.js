const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();
const userDb = require("../../Users/common/Dynamo");
const { v1: uuidv1 } = require("uuid");

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

async function getUserName(userId) {
  let searchParams = {
    TableName: "Users",
    Key: { userId: userId },
  };
  let data = await documentClient
    .get(searchParams)
    .promise()
    .catch((err) => {
      console.log("error in Dynamo Get username", err);
      return null;
    });
  let usernickName = data.Item.nickName;
  let userName = data.Item.email;
  if (usernickName) {
    return usernickName;
  } else {
    return userName;
  }
}
const Dynamo = {
  async _addComment(msgId, CommentData, userId) {
    const { cmt } = CommentData;
    let cmtParams = {
      Key: {
        msgId: { S: msgId },
      },
      TableName: "Messages",
      ConditionExpression: "attribute_exists(msgId)",
      UpdateExpression: "SET #ri = list_append(#ri,:vals)",
      ExpressionAttributeNames: {
        "#ri": "comments",
      },
      ExpressionAttributeValues: {
        ":vals": {
          L: [
            {
              M: [{ S: await getUserName(userId) }, { S: cmt }],
            },
          ],
        },
      },
      ReturnValues: "ALL_NEW",
    };
    return await dynamodb.updateItem(cmtParams).promise();
  },
  //Messages 좋아요 추가
  async _addLike(msgId) {
    let likeParams = {
      Key: {
        msgId: { S: msgId },
      },
      TableName: "Messages",
      ConditionExpression: "attribute_exists(msgId)",
      UpdateExpression: "SET goodLike = goodLike + :val ",
      ExpressionAttributeValues: {
        ":val": { N: "1" },
      },
      ReturnValues: "ALL_NEW",
    };
    return await dynamodb.updateItem(likeParams).promise();
  },
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
  async _update(msgData, msgId, userId) {
    const { msg } = msgData;
    let updateParams = {
      Key: {
        msgId: msgId,
      },
      TableName: "Messages",
      ConditionExpression: "attribute_exists(msgId)",
      UpdateExpression:
        "SET userName = :userName, msg = :msg, updateAt = :updateAt",
      ExpressionAttributeValues: {
        ":userName": await getUserName(userId),
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
  //Messages all render
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
  async _write(dataMsg, userId) {
    const { msg } = dataMsg;
    const userData = await userDb._search(userId);
    console.log(
      "🚀 ~ file: Dynamo.js ~ line 135 ~ _write ~ data",
      userData.Item.profileImage
    );
    const catchPo = (userData) =>
      userData.Item.profileImage ? userData.Item.profileImage : null;
    let putParams = {
      TableName: "Messages",
      Item: {
        msgId: uuidv1(),
        userName: await getUserName(userId),
        msg: msg,
        goodLike: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        userId: userId,
        profileImage: catchPo(userData),
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
