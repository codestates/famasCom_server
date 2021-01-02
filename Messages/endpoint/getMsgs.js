const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  if (!event) {
    //failed
    Response._400({ message: "missing the usedName from the path" });
  }

  const data = await Dynamo._scan().catch((err) => {
    console.log("error in Dynamo Get", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "Data successfully loaded.", data });
  }
  return Response._400({ message: "The data is not available." });
};
