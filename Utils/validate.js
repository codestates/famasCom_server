// Help function to generate an IAM policy
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  const authorizerToken = event.authorizationToken;
  const authorizerArr = authorizerToken.split(" ");
  const token = authorizerArr[1];
  if (
    authorizerArr.length !== 2 ||
    authorizerArr[0] !== "Bearer" ||
    authorizerArr[1].length === 0
  ) {
    return generatePolicy("undefined", "Deny", event.methodArn);
  }

  let decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
  if (
    typeof decodedJwt.userId !== "undefined" &&
    decodedJwt.userId.length > 0
  ) {
    return generatePolicy(decodedJwt.userId, "Allow", event.methodArn);
  }
  return generatePolicy("undefined", "Deny", event.methodArn);
};

const generatePolicy = function (principalId, effect, resource) {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.

  return authResponse;
};
