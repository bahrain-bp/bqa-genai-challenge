import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const getUsers: APIGatewayProxyHandler = async (event, context) => {
  const client = new CognitoIdentityServiceProvider({ region: 'us-east-1' });

  const params = {
    UserPoolId: 'us-east-1_PraHctOMo', // Replace with your User Pool ID
  };

  try {
    const data = await client.listUsers(params).promise();
    const users = data.Users || [];

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching users:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users' }),
    };
  }
};