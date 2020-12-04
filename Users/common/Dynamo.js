const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

function hashPassword(password) {
  let salt = "random string";
  let shasum = crypto.createHash("sha1");
  shasum.update(password + salt);
  let result = shasum.digest("hex");
  console.log("🚀 ~ file: Dynamo.js ~ line 16 ~ hashPassword ~ result", result);
  return result;
}

const Dynamo = {
  //Users 삭제
  async _delete(userId) {
    let deleteParams = {
      Key: {
        userId: userId,
      },
      TableName: "Users",
    };
    return await documentClient.delete(deleteParams).promise();
  },
  //Users 수정
  async _update(userData, userId) {
    const { nickName, password, user_name } = userData;
    let updateParams = {
      Key: {
        userId: userId,
      },
      TableName: "Users",
      ConditionExpression: "attribute_exists(userId)",
      UpdateExpression:
        "SET nickName = :nickName, password = :password, user_name = :user_name, updateAt = :updateAt",
      ExpressionAttributeValues: {
        ":nickName": nickName,
        ":password": hashPassword(password),
        ":user_name": user_name,
        ":updateAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    };
    let data = await documentClient.update(updateParams).promise();
    return data;
  },
  //Users 로그인
  async _signIn(userData) {
    let paramsScan = {
      TableName: "Users",
    };
    let data = await documentClient.scan(paramsScan).promise();
    let seached = { data }.data.Items;
    const { email, password } = userData;

    for (let i = 0; i < seached.length; i++) {
      if (
        seached[i].email === email &&
        seached[i].password === hashPassword(password)
      ) {
        console.log("There's the ID and password Here.");
        return seached[i];
      } else {
        console.log("There's NO !!!! the ID and password Here.");
      }
    }
  },
  //Users 회원가입
  async _signUp(userData, TableName) {
    let idScan = {
      TableName: "Users",
    };
    let data = await documentClient.scan(idScan).promise();
    let seached = { data }.data.Items;
    const { email, password } = userData;
    console.log(
      "🚀 ~ file: Dynamo.js ~ line 82 ~ _signUp ~ password",
      password
    );

    for (let i = 0; i < seached.length; i++) {
      if (
        seached[i].email === email &&
        seached[i].password === hashPassword(password)
      ) {
        // 중복아이디인 경우
        return;
      } else {
        let putParams = {
          TableName: "Users",
          Item: {
            userId: uuidv4(),
            email: email,
            password: password,
            createdAt: new Date().toISOString(),
          },
        };
        let data = await documentClient.put(putParams).promise();
        if (!data) {
          throw Error(`There was an error put in the data from ${TableName}`);
        }
        return data;
      }
    }
  },
};
module.exports = Dynamo;
