const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  event = JSON.parse(event.body);
  if (
    !event.email ||
    event.email.trim() === "" ||
    !event.password ||
    event.password.trim() === ""
  ) {
    //failed
    Response._400({
      message: "Post must have a email and password and they must not be empty",
    });
  }
  let userData = event;

  const data = await Dynamo._signUp(userData).catch((err) => {
    console.log("error in Dynamo userData post", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "userData has been successfully sent." });
  }
  return Response._400({ message: "already used email." });
};
