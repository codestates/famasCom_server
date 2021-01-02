const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  let userId = event.requestContext.authorizer.principalId;
  console.log(
    "🚀 ~ file: addComment.js ~ line 6 ~ exports.handler= ~ userId",
    userId
  );
  const { msgId } = event.pathParameters;
  event = JSON.parse(event.body);
  if (!event.pathParameters || !event.pathParameters.msgId) {
    //failed
    Response._400({ message: "missing the msgId from the path" });
  }
  let CommentData = event;
  let data = await Dynamo._addComment(msgId, CommentData, userId).catch(
    (err) => {
      console.log("error in Dynamo msgData update", err);
      return null;
    }
  );
  if (data) {
    //return data
    return Response._200({ message: "Added Successfully comment." });
  }
  return Response._400({ message: "Failed to add comment." });
};
