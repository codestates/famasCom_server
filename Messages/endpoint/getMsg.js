"use strict";
const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.msgId) {
    //failed
    Response._400({ message: "missing the msgId from the path" });
  }

  let msgId = event.pathParameters.msgId;
  const user = await Dynamo._get(msgId).catch((err) => {
    console.log("error in Dynamo Get", err);
    return null;
  });

  if (user) {
    //return data
    return Response._200({ user });
  }
  return Response._400({ message: "no msgId in data" });
};
