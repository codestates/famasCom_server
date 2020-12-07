const Responses = {
  _200(data = {}) {
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
  _201(data = {}) {
    const { userId } = data.data;
    return {
      headers: {
        Content_Type: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Set-Cookie": `mycookie=${userId}; SameSite=None; domain=localhost; Path=/; secure; HttpOnly;`,
      },
      statusCode: 201,
      body: JSON.stringify(data),
    };
  },
  _400(data = {}) {
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
