const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
const TableName = { TableName: "Messages" };

exports.handler = async (event) => {
  event = JSON.parse(event.body);
  if (!event) {
    //failed
    Response._400({ message: "missing input data" });
  }
  let dataMsg = event;

  const data = await Dynamo._write(dataMsg, TableName).catch((err) => {
    console.log("error in Dynamo post", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "It's a success. postMsg" });
  }
  return Response._400({ message: "Failed. postMsg" });
};
