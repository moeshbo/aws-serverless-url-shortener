// Import the AWS SDK v3 clients
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Import the 'crypto' module for generating a random ID
const crypto = require("crypto");

// Create the DynamoDB Document client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get the table name from the environment variable
const LINKS_TABLE_NAME = process.env.LINKS_TABLE_NAME;

exports.handler = async (event) => {
  // 1. Get the long URL from the request body
  const { longUrl } = JSON.parse(event.body);

  // 2. Generate a unique short ID (7 characters)
  const shortId = crypto.randomBytes(7).toString("base64url").slice(0, 7);

  // 3. Get the API Gateway URL to build the response
  const apiUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  // 4. Create the new item to save in DynamoDB
  const newItem = {
    shortId: shortId,
    longUrl: longUrl,
  };

  // 5. Create the PutCommand
  const command = new PutCommand({
    TableName: LINKS_TABLE_NAME,
    Item: newItem,
  });

  try {
    // 6. Save the item to the database
    await docClient.send(command);

    // 7. Return a successful response
    return {
      statusCode: 201, // 201 means "Created"
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortUrl: `${apiUrl}/${shortId}`,
        longUrl: longUrl,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not create link" }),
    };
  }
};