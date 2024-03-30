import { Api, Cognito, StackContext } from "sst/constructs";
import { StaticSite } from "sst/constructs";

export function AuthStack({ stack }: StackContext) {
  // Create Api
   // Create auth provider
const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });
  const api = new Api(stack, "Api_auth", {
    authorizers: {
        jwt: {
          type: "user_pool",
          userPool: {
            id: auth.userPoolId,
            clientIds: [auth.userPoolClientId],
          },
        },
      },
    defaults: {
      authorizer: "jwt",
    },
    routes: {
      "GET /private": "packages/functions/src/private.main",
      "GET /public": {
        function: "packages/functions/src/public.main",
        authorizer: "none",
      },
    },
  });
//helloooo
  
  
  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
   
  });

  
  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  // Show the API endpoint and other info in the output
  return {api,auth}

}