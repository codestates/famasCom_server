const Response = require("./Users/common/API_Response");

exports.handler = async (event) => {
  let origin = event.headers.origin;
  if (
    origin === "http://localhost:3000" ||
    "https://dev.d3ozv5r487dny8.amplifyapp.com" ||
    "https://dev.myfamas.com"
  ) {
    return Response._200({ message: process.env.KAKAO_SECRET });
  } else {
    return Response._400({ message: failed });
  }
};
