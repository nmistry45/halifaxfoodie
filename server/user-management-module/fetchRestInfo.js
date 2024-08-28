const AWS = require("aws-sdk"); // Load the AWS SDK for Node.jscustomerData

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  let responseBody = "";
  let statusCode = 0;
  let restaurantData = {};

  try {
    const params = {
      TableName: "restaurants",
    };
    var result = await documentClient.scan(params).promise();
    result.Items.map((item, index) => {
      let frontEmail = JSON.parse(event.body);
      if (item.email == frontEmail.email) {
        restaurantData = result.Items[index];
      }
    });
    responseBody = restaurantData;
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to get customer details: ${err}`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: responseBody,
  };
  return JSON.stringify(response);
};
