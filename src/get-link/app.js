// Import the AWS SDK v3 clients
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Create the DynamoDB Document client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get the table name from the environment variable
const LINKS_TABLE_NAME = process.env.LINKS_TABLE_NAME;

exports.handler = async (event) => {
  try {
    // 1. Get the shortId from the URL path
    const { shortId } = event.pathParameters;

    // 2. Create the GetCommand
    const command = new GetCommand({
      TableName: LINKS_TABLE_NAME,
      Key: {
        shortId: shortId,
      },
    });

    // 3. Get the item from DynamoDB
    const { Item } = await docClient.send(command);

    // 4. If the item exists, return a 302 redirect
    if (Item) {
      return {
        statusCode: 302, // 302 means "Found" (i.e., redirect)
        headers: {
          Location: Item.longUrl, // The browser will redirect to this URL
        },
      };
    } else {
      // 5. If not found, return a 404
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Link not found" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};