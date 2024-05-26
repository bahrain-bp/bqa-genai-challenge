import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";

const TableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
    const messageData = event.body ? JSON.parse(event.body).data : "";
    const { stage, domainName } = event.requestContext;

  // Get all the connections
  const connections = await dynamoDb
    .scan({ TableName, ProjectionExpression: "id" })
    .promise();

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  const postToConnection = async function ({ id }: { id: string }) {
    try {
      // Send the message to the given client
      await apiG
        .postToConnection({ ConnectionId: id, Data: messageData })
        .promise();
    } catch (e:any) {
      if (e.statusCode === 410) {
        // Remove stale connections
        await dynamoDb.delete({ TableName, Key: { id } }).promise();
      }
    }
  };

  // Iterate through all the connections
// Check if connections.Items is defined and is an array
if (connections.Items && Array.isArray(connections.Items)) {
    // Map over connections.Items to extract the id property and call postToConnection
    await Promise.all(
        connections.Items.map((item: any) => postToConnection({ id: item.id }))
    );
} else {
    console.error("connections.Items is undefined or not an array");
}

  return { statusCode: 200, body: "Message sent" };
};