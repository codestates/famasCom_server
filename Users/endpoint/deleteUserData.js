const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
exports.handler = async (event, callback) => {
  const userId = event.pathParameters.userId;

  let data = await Dynamo._delete(userId).catch((err) => {
    console.log("error in Dynamo userData update", err);
    return null;
  });
  if (data) {
    //return data
    return Response._200({ message: "It's a success. delete" });
  }
  return Response._400({ message: "Failed delete." });
};