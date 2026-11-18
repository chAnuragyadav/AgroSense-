const serverless = require("serverless-http");
const { app } = require("../../server/app");

const handler = serverless(app);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // don't wait for the open Mongo socket
  // Accept both /api/... (via redirect) and /.netlify/functions/api/... (direct call)
  event.path = event.path.replace(/^\/\.netlify\/functions\/api/, "/api");
  return handler(event, context);
};
