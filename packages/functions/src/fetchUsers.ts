import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const getUsers: APIGatewayProxyHandler = async (event, context) => {
  const client = new CognitoIdentityServiceProvider({ region: 'us-east-1' });

 
  const userPoolId: string = 'us-east-1_PraHctOMo'; // Your User Pool ID
  const groupName: string = 'universityOfficers';
  console.log(`Fetching users from group: ${groupName} in pool: ${userPoolId}`);


  try {
    const data = await client.listUsersInGroup(
      {
        UserPoolId: userPoolId,
        GroupName: groupName,
      }

    ).promise();
    console.log('Users fetched:', data.Users?.length);
    if (data.Users) {
      data.Users.forEach(user => console.log(user.Username));
    } else {
      console.log('No users found in the group.');
    }
    const users = data.Users || [];

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching users:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users from group' }),
    };
  }
};