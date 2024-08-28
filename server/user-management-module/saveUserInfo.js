const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const customerInfo = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  let userType = customerInfo.registerAs;

  const cusParams = {
    TableName: "customers",
    Item: {
      id: Math.floor(Math.random() * 1000),
      email: customerInfo.email,
      name: customerInfo.name,
      orderNumber: 0,
      orderRating: 0,
      active: false,
      userType: userType,
    },
  };

  const resParams = {
    TableName: "restaurants",
    Item: {
      restaurantID: Math.floor(Math.random() * 1000),
      email: customerInfo.email,
      menu: [],
      name: customerInfo.name,
      userType: userType,
    },
  };

  try {
    if (userType === "Customer") {
      await dynamodb.put(cusParams).promise();
      responseBody = `success`;
      statusCode = 200;
    } else if (userType === "Restaurant") {
      await dynamodb.put(resParams).promise();
      responseBody = `success`;
      statusCode = 200;
    }
  } catch (err) {
    responseBody = `Unable to save Customers: ${err}`;
    statusCode = 403;
  }
  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    data: responseBody,
  };
  return response;
};
