const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  const { msgId } = event.pathParameters;
  console.log(
    "🚀 ~ file: addLike.js ~ line 6 ~ exports.handler= ~ msgId",
    msgId
  );
  if (!event.pathParameters || !event.pathParameters.msgId) {
    //failed
    Response._400({ message: "missing the msgId from the path" });
  }
  let data = await Dynamo._addLike(msgId).catch((err) => {
    console.log("error in Dynamo msgData update", err);
    return null;
  });
  if (data) {
    //return data
    return Response._200({ message: "Added Successfully like." });
  }
  return Response._400({ message: "Failed to add like." });
};
