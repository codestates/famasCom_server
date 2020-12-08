const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  let userId = event.requestContext.authorizer.principalId;
  event = JSON.parse(event.body);
  if (!event) {
    //failed
    Response._400({ message: "missing input data" });
  }
  let dataMsg = event;

  const data = await Dynamo._write(dataMsg, userId).catch((err) => {
    console.log("error in Dynamo post", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "The message has been sent successfully" });
  }
  return Response._400({ message: "Message transmission failed." });
};
