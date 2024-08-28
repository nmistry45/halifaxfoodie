/**
 * Reference:
 * https://stackoverflow.com/questions/42489918/async-await-inside-arraymap
 */

const AWS = require("aws-sdk"); // Load the AWS SDK for Node.js
const documentClient = new AWS.DynamoDB.DocumentClient();

const https = require("https");
const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  let response = {};
  let isRatingDone = false;
  let addedRecipe = false;
  let id = 0;
  let orderRating = "";
  let restaurantID = 0;
  let recipeName = "";
  let recipeIng = "";
  let recipePrice = "";
  let restName = "";
  let menu = [];

  console.log("context is: ", context.awsRequestId);

  try {
    const params = {
      TableName: "customers",
    };

    const restParams = {
      TableName: "restaurants",
    };

    var result = await documentClient.scan(params).promise();
    var restResult = await documentClient.scan(restParams).promise();

    let arr = await Promise.all(
      result.Items.map(async (item, index) => {
        if (event.sessionState.intent.name === "TrackOrder") {
          if (event.sessionState.intent.slots.Email != null) {
            let email =
              event.sessionState.intent.slots.Email.value.originalValue;
            if (item.email === email) {
              response = {
                sessionState: {
                  dialogAction: {
                    slotToElicit: "OrderTracking",
                    type: "Delegate",
                  },
                  intent: {
                    confirmationState: "Confirmed",
                    name: "TrackOrder",
                    state: "Fulfilled",
                  },
                },
                messages: [
                  {
                    contentType: "PlainText",
                    content: "You are successfully verified!",
                  },
                ],
              };
            }
          } else if (event.sessionState.intent.slots.Email === null) {
            let orderNumber =
              event.sessionState.intent.slots.OrderTracking.value.originalValue;
            if (item.orderNumber === parseInt(orderNumber)) {
              response = {
                sessionState: {
                  dialogAction: {
                    type: "Close",
                  },
                  intent: {
                    confirmationState: "Confirmed",
                    name: "TrackOrder",
                    state: "Fulfilled",
                  },
                },
                messages: [
                  {
                    contentType: "PlainText",
                    content: "Order Status: En Route",
                  },
                ],
              };
            }
          }
        } else if (event.sessionState.intent.name === "RateOrder") {
          if (event.sessionState.intent.slots.Email != null) {
            let email =
              event.sessionState.intent.slots.Email.value.originalValue;
            if (item.email === email) {
              response = {
                sessionState: {
                  dialogAction: {
                    slotToElicit: "orderNumber",
                    type: "Delegate",
                  },
                  intent: {
                    confirmationState: "Confirmed",
                    name: "RateOrder",
                    state: "Fulfilled",
                  },
                },
                messages: [
                  {
                    contentType: "PlainText",
                    content: "You are successfully verified!",
                  },
                ],
              };
            }
          } else if (event.sessionState.intent.slots.Email === null) {
            let orderNumber =
              event.sessionState.intent.slots.orderNumber.value.originalValue;
            orderRating =
              event.sessionState.intent.slots.rating.value.originalValue;
            if (item.orderNumber === parseInt(orderNumber)) {
              id = item.id;
              isRatingDone = true;
            }
          }
        }
      })
    );
    if (isRatingDone) {
      try {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "RateOrder",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Your rating has been saved.",
            },
          ],
        };
        await saveRating(orderRating, id);
      } catch (err) {
        console.log("Error in awaiting to save Rating:", err);
      }
    }
    let newArr = await Promise.all(
      restResult.Items.map(async (item, index) => {
        if (event.sessionState.intent.name === "AddRecipes") {
          if (event.sessionState.intent.slots.Email != null) {
            let email =
              event.sessionState.intent.slots.Email.value.originalValue;
            if (item.email === email) {
              response = {
                sessionState: {
                  sessionAttributes: {
                    restEmail: email,
                  },
                  dialogAction: {
                    slotToElicit: "recipeName",
                    type: "Delegate",
                  },
                  intent: {
                    confirmationState: "Confirmed",
                    name: "AddRecipes",
                    state: "Fulfilled",
                  },
                },
                messages: [
                  {
                    contentType: "PlainText",
                    content: "You are successfully verified!",
                  },
                ],
              };
            }
          } else if (event.sessionState.intent.slots.Email === null) {
            restaurantID = item.restaurantID;
            restName = item.name;
            menu = item.menu;
            recipeName =
              event.sessionState.intent.slots.recipeName.value.originalValue;
            recipeIng =
              event.sessionState.intent.slots.recipeIng.value.originalValue;
            recipePrice =
              event.sessionState.intent.slots.recipePrice.value.originalValue;
            if (restaurantID === item.restaurantID) {
              addedRecipe = true;
            }
          }
        }
      })
    );
    if (addedRecipe) {
      let email = event.sessionState.sessionAttributes.email;
      try {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "AddRecipes",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Your recipe has been saved.",
            },
          ],
        };
        await saveRecipe(
          menu,
          email,
          restName,
          restaurantID,
          recipeName,
          recipeIng,
          recipePrice
        );
      } catch (err) {
        console.log("Error in awaiting to save Recipe:", err);
      }
    }
    if (event.sessionState.intent.name === "WebNav") {
      let userReq =
        event.sessionState.intent.slots.destination.value.originalValue;
      if (userReq === "login") {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "WebNav",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "You cannot access the website without logging in.",
            },
          ],
        };
      } else if (userReq === "chatbot") {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "WebNav",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content:
                "You can find the chatbot and converse with it with the button with the chat symbol at the right bottom corner of the screen.",
            },
          ],
        };
      } else if (userReq === "chat") {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "WebNav",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content:
                "You have to raise a complaint within the chatbot by typing issue or complaint, and then provide the email and names. You will then get an ID to connect that you will paste on the Enter the Chatroom ID button on top of the website.",
            },
          ],
        };
      }
    } else if (event.sessionState.intent.name === "ErrComp") {
      let restaurantName =
        event.sessionState.intent.slots.restaurant.value.originalValue;
      let customer_email =
        event.sessionState.intent.slots.order.value.originalValue;
      console.log(
        "restaurant name is: " +
          restaurantName +
          " and customer_email is : " +
          customer_email
      );

      const data = await publishToGCP(
        customer_email,
        restaurantName,
        context.awsRequestId
      );
      return data;
    }
  } catch (err) {
    console.log("Error while Verifying:", err);
    response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          confirmationState: "None",
          name: "TrackOrder",
          state: "Failed",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "Sorry, you are not verified! Please try again.",
        },
      ],
    };
  }
  return response;
};

async function publishToGCP(user_email, rest_name, chatRoomID) {
  const payload = {
    rest_name: rest_name,
    user_email: user_email,
    chatRoomID: chatRoomID,
  };

  await publishMessage(payload);

  let response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        confirmationState: "Confirmed",
        name: "ErrComp",
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content:
          `Open Dialogbox and paste this chatroomID to initiate new chatroom </br> ` +
          chatRoomID,
      },
    ],
  };

  return response;
}

async function publishMessage(payload) {
  try {
    const res = await fetch(
      "https://us-central1-csci-5408-w21-340820.cloudfunctions.net/customer-issue-publisher",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Res", res);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}

async function saveRating(orderRating, id) {
  let updateParams = {
    TableName: "customers",
    Key: {
      id: id,
    },
    UpdateExpression: "set orderRating = :r",
    ExpressionAttributeValues: {
      ":r": orderRating,
    },
    ReturnValues: "UPDATED_NEW",
  };
  let data;
  try {
    data = await documentClient.update(updateParams).promise();
  } catch (err) {
    console.log("Promise Error in Saving Rating:", err);
  }
  return data;
}

async function saveRecipe(
  menu,
  email,
  restName,
  restaurantID,
  recipeName,
  recipeIng,
  recipePrice
) {
  menu.push({
    recipeID: Math.floor(Math.random() * 1000),
    recipeName: recipeName,
    recipeIng: recipeIng,
    recipePrice: recipePrice,
  });
  let restParams = {
    TableName: "restaurants",
    Item: {
      restaurantID: restaurantID,
      email: email,
      name: restName,
      menu: menu,
    },
  };
  let data;
  try {
    data = await documentClient.put(restParams).promise();
  } catch (err) {
    console.log("Promise Error in Saving Recipe:", err);
  }
  return data;
}
