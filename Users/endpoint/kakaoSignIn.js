const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");
exports.handler = async (event) => {
  const { userId } = event.pathParameters;
  if (!event.pathParameters || !event.pathParameters.userId) {
    //failed
    Response._400({ message: "missing the userId from the path" });
  }

  const data = await Dynamo._kakaoSignIn(userId).catch((err) => {
    console.log("error in Dynamo userData post", err);
    return null;
  });

  if (data) {
    return Response._201({
      message: "Login completed successfully.",
      data,
    });
  } else {
    return Response._400({ message: "Login failed." });
  }
};
