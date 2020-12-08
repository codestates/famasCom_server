const Dynamo = require("./Users/common/Dynamo");
const Response = require("./Users/common/API_Response");

exports.handler = async (event) => {
  let userId = event.requestContext.authorizer.principalId;
  let data = await Dynamo._search(userId).catch((err) => {
    console.log("error in Dynamo Get username", err);
    return null;
  });
  if (data) {
    return Response._200({
      message: "successfully rendered",
      username: data.Item.user_name,
      userNickname: data.Item.nickName,
    });
  }
};
