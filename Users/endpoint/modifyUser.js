const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  const userId = event.pathParameters.userId;
  event = JSON.parse(event.body);
  if (
    !event.user_name ||
    event.user_name.trim() === "" ||
    !event.password ||
    event.password.trim() === "" ||
    !event.nickName ||
    event.nickName.trim() === ""
  ) {
    //failed
    Response._400({
      message: "Post must have a email and password and they must not be empty",
    });
  }
  let userData = event;

  const data = await Dynamo._update(userData, userId).catch((err) => {
    console.log("error in Dynamo userData update", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "It's a success. modify", data });
  }
  return Response._400({ message: "Failed modify." });
};
