import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { AuthStack } from "./AuthStack";
import * as iam from '@aws-cdk/aws-iam';



export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { table } = use(DBStack);

  const api = new Api(stack, "signinAPI", {
    // Commented out the authorizers section
    // authorizers: {
    //   jwt: {
    //     type: "user_pool",
    //     userPool: {
    //       id: auth.userPoolId,
    //     },
    //   },
    // },
    defaults: {
      function: {
        bind: [table], // Bind the table name to our API
      },
      // Optional: Remove authorizer from defaults if set to "jwt"
      // authorizer: "jwt",
    },
    routes: {
      // Sample TypeScript lambda function
      "POST /": "packages/functions/src/lambda.main",
      "POST /uploadS3": {
        function: {
          handler: "packages/functions/src/s3Upload.uploadToS3",
          permissions: ["s3"],
        },
      },
      "GET /detectFileType": {
        function: {
          handler: "packages/functions/detectFileType.detect",
          permissions: ["s3"],
        },
      },
      "GET /private": "packages/functions/src/private.main",
      // Another sample TypeScript lambda function
      "POST /private": "packages/functions/src/private.main",
      // Sample Python lambda function
      "GET /": {
        function: {
          handler: "packages/functions/src/sample-python-lambda/lambda.main",
          runtime: "python3.11",
          timeout: "60 seconds",
        },
      },
      // Add the new route for retrieving files
      "GET /files": {
        function: {
          handler: "packages/functions/src/retrieveS3.main", // Replace with your location
          permissions: ["s3"], // Grant necessary S3 permissions
        },
      },

      "POST /createUser": {
        function: {
          handler: "packages/functions/createUser.createUserInCognito",
          permissions: "*",
          //permissions wil be changed
        },
      },

      "GET /summarization/{id}": "packages/functions/src/retrieveSummarization.main",
      //Uploading logo to S3
      /*
      "POST /uploadLogo": {
        function: {
          handler: "packages/functions/uploadLogo.uploadLogo",
          permissions: "*"
        }
      },
      */



      //Fetching all users in cognito
      "GET /getUsers": {
        function: {
          handler: "packages/functions/src/fetchUsers.getUsers", // Replace with your location
          permissions: [
            "cognito-idp:ListUsers" // Add any additional permissions if required
          ]
        },
      },

    },
  });
  const get_users_function = api.getFunction("POST /createUser");
  get_users_function?.role?.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser")
  );

  // Define cache policy for the API
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration.seconds(0), // No cache by default unless backend decides otherwise
    defaultTtl: Duration.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer"
    ),
  });

  return { api, apiCachePolicy };
}
