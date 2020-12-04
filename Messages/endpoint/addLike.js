const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  const { msgId } = event.pathParameters;
  //event = JSON.parse(event.body);
  if (!event.pathParameters || !event.pathParameters.msgId) {
    //failed
    Response._400({ message: "missing the msgId from the path" });
  }
  // let addLike = event;
  // console.log(
  //   "🚀 ~ file: addlike.js ~ line 12 ~ exports.handler= ~ addLike",
  //   addLike
  // );
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
