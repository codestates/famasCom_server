const jwt = require("jsonwebtoken");

const Responses = {
  _200(data) {
    return {
      headers: {
        Content_Type: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  _201(data) {
    const { userId } = data.data;
    const idF = (userId, data) => (userId ? userId : data.data.Item.userId);
    const token = jwt.sign(
      { userId: idF(userId, data) },
      process.env.JWT_SECRET
    );
    return {
      headers: {
        Content_Type: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        session_id: token,
      },
      statusCode: 201,
      body: JSON.stringify({ data: data, token }),
    };
  },
  _400(data) {
    return {
      headers: {
        Content_Type: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },
};

module.exports = Responses;
