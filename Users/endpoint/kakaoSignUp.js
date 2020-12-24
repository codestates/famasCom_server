const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
exports.handler = async (event) => {
  let userData = JSON.parse(event.body);
  const data = await Dynamo._kakaoSignUp(userData).catch((err) => {
    console.log("error in Dynamo userData post", err);
    return null;
  });
  if (data) {
    return Response._200({
      message: "Login completed successfully.",
    });
  } else {
    return Response._400({ message: "Login failed." });
  }
};
