const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const salt = process.env.USER_PW_SALT;
const hashMethod = process.env.HASH_METHOD;
const DIGEST = process.env.DIGEST;

AWS.config.update({
  region: "ap-northeast-2",
  endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com",
});

function hashPassword(password) {
  return crypto
    .createHash(hashMethod)
    .update(password + salt)
    .digest(DIGEST);
}

const Dynamo = {
  //Users 유저 찾기, 첫 프론트페이지 render
  async _search(userId) {
    let searchParams = {
      TableName: "Users",
      Key: { userId: userId },
    };
    return await documentClient.get(searchParams).promise();
  },
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
  //카카오톡 로그인
  async _kakaoSignIn(userId) {
    return await this._search(userId)
      .then((data) => data)
      .catch((err) => err);
  },
  async _kakaoSignUp(userData) {
    const { email, nickName, profileImage, userId } = userData;
    const putParams = {
      TableName: "Users",
      Item: {
        userId: userId,
        email: email,
        nickName: nickName,
        profileImage: profileImage,
        createdAt: new Date().toISOString(),
      },
    };
    return await documentClient.put(putParams).promise();
  },
  //Users 회원가입
  async _signUp(userData, TableName) {
    let idScan = {
      TableName: "Users",
    };
    let data = await documentClient.scan(idScan).promise();
    let seached = { data }.data.Items;
    const { email, password } = userData;

    for (let i = 0; i < seached.length; i++) {
      if (seached[i].email === email) {
        // 중복아이디인 경우
        return null;
      } else {
        let putParams = {
          TableName: "Users",
          Item: {
            userId: uuidv4(),
            email: email,
            password: hashPassword(password),
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
