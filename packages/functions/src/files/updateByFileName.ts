import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Log the entire event for debugging

  const tableName = Table.FileTable.tableName;
  const fileName =
    event.headers["fileName"] ||
    event.headers["filename"] ||
    event.headers["FileName"];

  console.log("Extracted fileName:", fileName); // Log the extracted fileName for debugging

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "fileName header is required" }),
    };
  }

  // Build the update expression and attribute values dynamically
  let updateExpression = "set";
  let expressionAttributeValues: { [key: string]: any } = {};
  let expressionAttributeNames: { [key: string]: string } = {};
  let isAnyUpdate = false;

  const fields = [
    "fileURL",
    "standardName",
    "indicatorName",
    "standardNumber",
    "indicatorNumber",
    "name",
    "content",
    "summary",
    "strength",
    "weakness",
    "score",
    "comments",
  ];

  fields.forEach((field) => {
    const headerValue = event.headers[field];
    if (headerValue !== undefined) {
      updateExpression += ` #${field} = :${field},`;
      expressionAttributeValues[`:${field}`] = headerValue;
      expressionAttributeNames[`#${field}`] = field;
      isAnyUpdate = true;
    }
  });

  // Remove the trailing comma from the update expression
  if (isAnyUpdate) {
    updateExpression = updateExpression.slice(0, -1);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No fields provided for update" }),
    };
  }

  const params = {
    TableName: tableName,
    Key: { fileName: fileName },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Update successful",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Update failed:", error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update item" }),
    };
  }
};
