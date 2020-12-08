const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
exports.handler = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const msgId = event.pathParameters.msgId;

  let data = await Dynamo._delete(msgId).catch((err) => {
    console.log("error in Dynamo msgData update", err);
    return null;
  });
  if (data) {
    //return data
    return Response._200({ message: "The message has been deleted.", userId });
  }
  return Response._400({ message: "Failed to delete message." });
};
