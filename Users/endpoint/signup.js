const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
const TableName = { TableName: "Users" };

exports.handler = async (event) => {
  console.log(
    "🚀 ~ file: signup.js ~ line 6 ~ exports.handler= ~ event",
    event
  );
  if (!event) {
    //failed
    Response._400({ message: "missing input userData" });
  }
  let userData = event;

  const data = await Dynamo.write(userData, TableName).catch((err) => {
    console.log("error in Dynamo userData post", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "It's a success. userData" });
  }
  return Response._400({ message: "Failed." });
};
