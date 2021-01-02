const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  let userId = event.requestContext.authorizer.principalId;
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
    return Response._200({
      message: "Modification of member information has been completed.",
      data,
    });
  }
  return Response._400({ message: "Member information modification failed." });
};
